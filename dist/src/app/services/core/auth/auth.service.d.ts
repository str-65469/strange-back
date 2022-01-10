import User from 'src/database/entity/user.entity';
import { UsersService } from 'src/app/services/core/user/users.service';
import { UserDetailsServiceService } from 'src/app/services/core/user/user_details.service';
import { UserLoginDto } from 'src/app/common/request/user/user_login.dto';
import { UserRegisterCacheService } from '../user/user_register_cache.service';
import { LolServer } from 'src/app/common/enum/lol_server.enum';
import { UserForgotPasswordCacheService } from '../user/user_forgot_password.service';
export declare class AuthService {
    private readonly userService;
    private readonly userDetailsService;
    readonly userRegisterCacheService: UserRegisterCacheService;
    readonly userForgotPasswordCacheService: UserForgotPasswordCacheService;
    constructor(userService: UsersService, userDetailsService: UserDetailsServiceService, userRegisterCacheService: UserRegisterCacheService, userForgotPasswordCacheService: UserForgotPasswordCacheService);
    validateUser(userCredentials: UserLoginDto): Promise<User>;
    usernameEmailExists(email: string, username: string, opts?: {
        inCache: boolean;
    }): Promise<any>;
    emailExists(email: string, opts?: Partial<{
        inForgotPasswordCache: boolean;
    }>): Promise<User | import("../../../../database/entity/forgot_password_cache.entity").ForgotPasswordCache>;
    summonerNameAndServerExists(server: LolServer, summonerName: string): Promise<void>;
    retrieveRegisterCachedData(id: number): Promise<import("../../../../database/entity/user_register_cache.entity").UserRegisterCache>;
    retrieveForgotPasswordCachedData(id: number): Promise<import("../../../../database/entity/forgot_password_cache.entity").ForgotPasswordCache>;
}
