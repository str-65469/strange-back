import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entity/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRegisterCache } from '../../../database/entity/user_register_cache.entity';
import { RandomGenerator } from 'src/app/utils/random_generator.helper';
import { LolServer } from '../../common/enum/lol_server.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { configs } from 'src/configs/config';
import { In, Not, Repository } from 'typeorm';
import { Request } from 'express';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { Socket } from 'socket.io';
import { LolLeague } from 'src/app/common/enum/lol_league.enum';
import { AccessTokenPayload } from 'src/app/common/services/jwt_access.service';
import { UserProfileUpdateDto } from 'src/app/schemas/request/user/user_update.dto';
import { UserPasswordUpdateDto } from 'src/app/schemas/request/user/user_update_password.dto';
import { generateCompressedSprite } from 'src/app/utils/dicebear.helper';
import { GenericException, GenericExceptionResponse } from 'src/app/common/exceptions/general.exception';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';
import { UserRepository } from '../../repositories/user_repository';
import { NetworkProvider } from '../network/network.provider';
import { AxiosError } from '@yggdrasilts/axiosfit';
import { right, left } from 'src/app/common/either';
import { SummonerDetailsFailure } from 'src/app/common/failures/lol_api/summoner_details.failure.enum';
import { SummonerDetailsResponse } from '../network/dto/response/summoner_details.response';
import { SummonerDetailsAndLeagueFailure } from 'src/app/common/failures/lol_api/summoner_details_league.failure.enum';
import { SummonerDetailsAndLeagueResponse } from '../network/dto/response/summoner_details_league.response';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly networkProvider: NetworkProvider,
        private readonly jwtService: JwtService,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(UserDetails) private readonly userDetailsRepo: Repository<UserDetails>,
        @InjectRepository(UserRegisterCache)
        private readonly registerCacheRepo: Repository<UserRegisterCache>,
    ) {}

    userID(request: Request) {
        const accessToken = request.cookies?.access_token;

        if (!accessToken) {
            throw new GenericException(
                HttpStatus.UNAUTHORIZED,
                ExceptionMessageCode.ACCESS_TOKEN_MISSING,
                configs.messages.exceptions.accessTokenMissing,
            );
        }

        const accessTokenDecoded = this.jwtService.decode(accessToken) as { id: number; email: string };
        return accessTokenDecoded.id;
    }

    async user(id: number) {
        return await this.userRepo.findOne(id);
    }

    async getUserDetails(id?: number) {
        return await this.userRepo.findOne(id, {
            relations: ['details', 'belongings'],
        });
    }

    userSocketPayload(socket: Socket): AccessTokenPayload {
        const token = socket.handshake?.auth?.token;
        const accessTokenDecoded = this.jwtService.decode(token) as AccessTokenPayload;

        return accessTokenDecoded;
    }

    async userSpamAndDetails(id: number) {
        return await this.userRepo.findOne(id, { relations: ['spams', 'details'] });
    }

    updateOnlineStatus(id: number, bool: boolean) {
        return this.userRepository.updateOnlineStatus(id, bool);
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepo.findOne(id);
    }

    findOneForced(id: number): Promise<User> {
        return this.userRepo.createQueryBuilder().where('id = :id', { id }).select('*').getRawOne();
    }

    async findOneByEmail(
        email: string,
        opts?: Partial<{ fetchPassword: boolean; fetchDetails: boolean }>,
    ): Promise<User | undefined> {
        if (opts?.fetchPassword) {
            return this.userRepo
                .createQueryBuilder('users')
                .where('users.email = :email', { email })
                .addSelect('users.password')
                .getOne();
        }

        if (opts?.fetchDetails) {
            return this.userRepo.findOne({ where: { email }, relations: ['details'] });
        }

        return this.userRepo.findOne({ where: { email } });
    }

    findByEmailOrUsername(email: string, username: string) {
        return this.userRepo.findOne({ where: [{ email }, { username }] });
    }

    async updateImagePath(id, path: string) {
        const user = await this.userRepo.findOne(id);

        user.img_path = '/user/profiles/' + path;

        return await this.userRepo.save(user);
    }

    async saveUserByCachedData(userCached: UserRegisterCache, secret: string, ip: string): Promise<User> {
        const { email, password, username } = userCached;

        const user = this.userRepo.create({
            ip,
            email,
            password,
            username,
            secret,
            img_path: generateCompressedSprite() as string,
            socket_id: RandomGenerator.randomString(),
        });

        return await this.userRepo.save(user);
    }

    async saveUser(user: User, secret: string) {
        user.secret = secret;

        return await this.userRepo.save(user);
    }

    async updateUserProfile(id: number, data: UserProfileUpdateDto) {
        const { username, discord_name, main_champions, main_lane } = data;

        // update user username
        await this.userRepo.save({ id, username });

        const userDetails = await this.userDetailsRepo.findOne({ where: { user: id } });

        userDetails.discord_name = discord_name;
        userDetails.main_champions = main_champions;
        userDetails.main_lane = main_lane;

        // update user details
        await this.userDetailsRepo.save(userDetails);

        return await this.getUserDetails(id);
    }

    async updateUserCredentials(id: number, data: UserPasswordUpdateDto): Promise<User> {
        const password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(12));

        // update user
        const user = await this.findOneForced(id);
        user.password = password;

        await this.userRepo.save(user);

        return await this.getUserDetails(id);
    }

    async updatePassword(id: number, newPassword: string) {
        const password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(12));

        return this.userRepo.update(id, {
            password,
        });
    }

    // async updateOnlineStatus(userId: number, status: boolean) {
    //     await this.userRepo.update(userId, {
    //         is_online: status,
    //     });
    // }

    public async findNewDuoDetails(user: User, prevId?: number) {
        const { accept_list, remove_list, decline_list, matched_list } = user.spams;

        const al = accept_list ?? [];
        const rl = remove_list ?? [];
        const dl = decline_list ?? [];
        const ml = matched_list ?? [];

        // filter plus current
        let filterList = [...new Set([...al, ...rl, ...dl, ...ml, user.id])];

        // league filtering
        const leagues = Object.values(LolLeague);

        const currEnumIndex = leagues.indexOf(user.details.league);
        let filteredLeagues = [];
        if (currEnumIndex === 0) {
            filteredLeagues = leagues.filter((_, i) => i <= currEnumIndex + 1);
        } else if (currEnumIndex === leagues.length - 1) {
            filteredLeagues = leagues.filter((_, i) => i >= currEnumIndex - 1);
        } else {
            filteredLeagues = leagues.filter((_, i) => i >= currEnumIndex - 1 && i <= currEnumIndex + 1);
        }

        return this.userDetailsRepo.findOne({
            where: {
                user: Not(In(prevId ? [...filterList, prevId] : filterList)),
                league: In(filteredLeagues),
                server: user.details.server,
            },

            order: { created_at: 'DESC' },
            relations: ['user'],
        });
    }

    public summonerNameDetails(server: LolServer, summonerName: string) {
        return this.networkProvider.lolRemoteService
            .summonerNameDetails(server, summonerName)
            .then((res) => right<SummonerDetailsFailure, SummonerDetailsResponse>(res.data))
            .catch((e: AxiosError<GenericExceptionResponse>) => {
                if (e.isAxiosError) {
                    switch (e.response?.data.messageCode) {
                        case ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND:
                            return left<SummonerDetailsFailure, SummonerDetailsResponse>(
                                SummonerDetailsFailure.SUMMONER_NAME_NOT_FOUND,
                            );
                    }
                }

                return left<SummonerDetailsFailure, SummonerDetailsResponse>(SummonerDetailsFailure.UNKNOWN);
            });
    }

    public summonerNameDetailsAndLeague(server: LolServer, summonerName: string) {
        return this.networkProvider.lolRemoteService
            .summonerNameDetailsAndLeague(server, summonerName)
            .then((res) => right<SummonerDetailsAndLeagueFailure, SummonerDetailsAndLeagueResponse>(res.data))
            .catch((e: AxiosError<GenericExceptionResponse>) => {
                if (e.isAxiosError) {
                    switch (e.response?.data.messageCode) {
                        case ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND:
                            return left<SummonerDetailsAndLeagueFailure, SummonerDetailsAndLeagueResponse>(
                                SummonerDetailsAndLeagueFailure.SUMMONER_NAME_NOT_FOUND,
                            );

                        case ExceptionMessageCode.SUMMONER_DIVISION_ERROR:
                            return left<SummonerDetailsAndLeagueFailure, SummonerDetailsAndLeagueResponse>(
                                SummonerDetailsAndLeagueFailure.SUMMONER_DIVISION_ERROR,
                            );
                    }
                }

                return left<SummonerDetailsAndLeagueFailure, SummonerDetailsAndLeagueResponse>(
                    SummonerDetailsAndLeagueFailure.UNKNOWN,
                );
            });
    }
}
