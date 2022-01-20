import * as bcrypt from 'bcrypt';
import User from 'src/database/entity/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/modules/user/users.service';
import { UserDetailsServiceService } from 'src/app/modules/user/user_details.service';
import { UserLoginDto } from 'src/app/schemas/request/user/user_login.dto';
import { UserRegisterCacheService } from '../user/user_register_cache.service';
import { LolServer } from 'src/app/common/enum/lol_server.enum';
import { UserForgotPasswordCacheService } from '../user/user_forgot_password.service';
import { GenericException } from 'src/app/common/exceptions/general.exception';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { NetworkProvider } from '../network/network.provider';
import { LolAuthStatus } from 'src/app/common/enum/lol_auth_statuses.enum';
import { UserRegisterDto } from 'src/app/schemas/request/user/user_register.dto';
import { JwtAcessService } from 'src/app/common/services/jwt_access.service';
import { configs } from 'src/configs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtAcessService: JwtAcessService,
        private readonly userDetailsService: UserDetailsServiceService,
        private readonly networkProvider: NetworkProvider,
        readonly userRegisterCacheService: UserRegisterCacheService,
        readonly userForgotPasswordCacheService: UserForgotPasswordCacheService,
    ) {}

    async validateUser(userCredentials: UserLoginDto): Promise<User> {
        // find user
        const user = await this.userService.findOneByEmail(userCredentials.email, { fetchPassword: true });

        if (!user) {
            throw new GenericException(
                HttpStatus.NOT_FOUND,
                ExceptionMessageCode.USER_EMAIL_OR_PASSWORD_INCORRECT,
            );
        }

        const isPasswordMatch = await bcrypt.compare(userCredentials.password, user.password);

        if (!isPasswordMatch) {
            throw new GenericException(
                HttpStatus.NOT_FOUND,
                ExceptionMessageCode.USER_EMAIL_OR_PASSWORD_INCORRECT,
            );
        }

        return user;
    }

    async emailExists(email: string, opts?: Partial<{ inForgotPasswordCache: boolean }>) {
        if (opts?.inForgotPasswordCache) {
            const user = await this.userForgotPasswordCacheService.findByEmail(email);

            return user;
        }

        const user = await this.userService.findOneByEmail(email, { fetchDetails: true });

        if (!user) {
            throw new GenericException(HttpStatus.NOT_FOUND, ExceptionMessageCode.USER_NOT_FOUND);
        }

        return user;
    }

    async renewSummonerNameAndServer(
        oldSummonerCache: UserRegisterCache | null,
        server: LolServer,
        summonerName: string,
    ) {
        // if exists delete and then renew,then create new and then return
        if (oldSummonerCache) {
            await this.userRegisterCacheService.delete(oldSummonerCache.id);
        }

        // fetch data from lol
        const summonerData = await this.networkProvider.lolRemoteService.summonerNameDetailsAndLeague(
            server,
            summonerName,
        );

        // create new
        return this.userRegisterCacheService.createFirstStepCache(server, summonerName, summonerData.data);
    }

    async retrieveRegisterCachedData(id: number) {
        const cachedData = await this.userRegisterCacheService.findOne(id);

        if (!cachedData) {
            throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.REGISTER_CACHE_NOT_FOUND);
        }

        return cachedData;
    }

    async retrieveForgotPasswordCachedData(id: number) {
        const cachedData = await this.userForgotPasswordCacheService.findOne(id);

        if (!cachedData) {
            throw new GenericException(
                HttpStatus.BAD_REQUEST,
                ExceptionMessageCode.FORGOT_PASSWORD_CACHE_NOT_FOUND,
            );
        }

        return cachedData;
    }

    async checkCacheAndValidation(server: LolServer, summonerName: string, uuid?: string) {
        // check if summoner name and server exists in cache
        const userRegCache = await this.retrieveRegisterCache(server, summonerName, uuid);

        if (!userRegCache) {
            throw new GenericException(HttpStatus.NOT_FOUND, ExceptionMessageCode.REGISTER_CACHE_NOT_FOUND);
        }

        return {
            userRegCache,
            status: userRegCache.is_valid ? LolAuthStatus.VALID : LolAuthStatus.INVALID,
        };
    }

    retrieveRegisterCache(server: LolServer, summonerName: string, uuid?: string) {
        if (uuid) {
            return this.userRegisterCacheService.findBySummonerAndServerAndUUID(server, summonerName, uuid);
        }

        return this.userRegisterCacheService.findBySummonerAndServer(server, summonerName);
    }

    async cacheUserRegister(userRegCache: UserRegisterCache, body: UserRegisterDto) {
        const { email, password, username: username } = body;

        const secret = this.jwtAcessService.jwtService.sign(
            { email, summoner_name: userRegCache.summoner_name, username },
            { expiresIn: configs.tokens.user_register_token, secret: process.env.JWT_REGISTER_CACHE_SECRET },
        );

        const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
        const d1 = new Date();
        const d2 = new Date(d1);
        d2.setMinutes(d1.getMinutes() + 30);

        await this.userRegisterCacheService.updateUserDetails(userRegCache.id, {
            email,
            username,
            password: pass,
            secret_token: secret,
            expiry_date: d2,
        });

        // fetch updated
        return this.userRegisterCacheService.findOne(userRegCache.id);
    }
}
