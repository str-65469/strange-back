import User from 'src/database/entity/user.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { UserRegisterCache } from '../../../../database/entity/user_register_cache.entity';
import { LolCredentialsResponse } from '../../../common/schemas/lol_credentials';
import { LolServer } from '../../../common/enum/lol_server.enum';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { Socket } from 'socket.io';
import { LolLeague } from 'src/app/common/enum/lol_league.enum';
import { AccessTokenPayload } from 'src/app/services/common/jwt_access.service';
import { UserRegisterDto } from 'src/app/common/request/user/user_register.dto';
import { UserProfileUpdateDto } from 'src/app/common/request/user/user_update.dto';
import { UserPasswordUpdateDto } from 'src/app/common/request/user/user_update_password.dto';
export declare type UserSpamDetailed = User & {
    details: UserDetails;
    spams: MatchingSpams;
};
export declare class UsersService {
    private readonly httpService;
    private readonly jwtService;
    private readonly userRepo;
    private readonly userDetailsRepo;
    private readonly registerCacheRepo;
    constructor(httpService: HttpService, jwtService: JwtService, userRepo: Repository<User>, userDetailsRepo: Repository<UserDetails>, registerCacheRepo: Repository<UserRegisterCache>);
    userID(request: Request): number;
    user(id: number): Promise<User>;
    getUserDetails(id?: number): Promise<User>;
    userSocketPayload(socket: Socket): AccessTokenPayload;
    userSpamAndDetails(id: number): Promise<User>;
    findOne(id: number): Promise<User>;
    findOneForced(id: number): Promise<User>;
    findOneByEmail(email: string, opts?: Partial<{
        fetchPassword: boolean;
        fetchDetails: boolean;
    }>): Promise<User | undefined>;
    findByEmailOrUsername(email: string, username: string): Promise<User>;
    updateImagePath(id: any, path: string): Promise<User>;
    checkLolCredentialsValid(server: LolServer, summoner_name: string): Promise<{
        level: number;
        profileImageId: number;
        league: LolLeague;
        league_number: number;
        league_points: number;
        win_rate: number;
    }>;
    cacheUserRegister(body: UserRegisterDto, details: LolCredentialsResponse): Promise<UserRegisterCache>;
    saveUserByCachedData(userCached: UserRegisterCache, secret: string, ip: string): Promise<User>;
    saveUser(user: User, secret: string): Promise<User>;
    updateUserProfile(id: number, data: UserProfileUpdateDto): Promise<User>;
    updateUserCredentials(id: number, data: UserPasswordUpdateDto): Promise<User>;
    updatePassword(id: number, newPassword: string): Promise<import("typeorm").UpdateResult>;
    updateOnlineStatus(userId: number, status: boolean): Promise<void>;
    findNewDuoDetails(user: User, prevId?: number): Promise<UserDetails>;
}
