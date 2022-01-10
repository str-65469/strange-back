import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from '../services/core/auth/auth.service';
import { JwtAcessService } from '../services/common/jwt_access.service';
import { MailService } from 'src/app/mail/mail.service';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { CookieService } from 'src/app/services/common/cookie.service';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matching_spam.service';
import { UserLoginDto } from '../common/request/user/user_login.dto';
import { UsersService } from '../services/core/user/users.service';
import { UserDetailsServiceService } from '../services/core/user/user_details.service';
import { UserRegisterCacheService } from '../services/core/user/user_register_cache.service';
import { UserRegisterDto } from '../common/request/user/user_register.dto';
import { ForgotPasswordRequest } from '../security/guards/jwt_forgot_password.guard';
import { ForgotPasswordRequestDto } from '../common/request/forgot_password/forgot_password.dto';
import { ForgotPasswordConfirmRequestDto } from '../common/request/forgot_password/forgot_password_confirm.dto';
export declare class AuthController {
    private readonly cookieService;
    private readonly authService;
    private readonly userService;
    private readonly jwtService;
    private readonly jwtAcessService;
    private readonly mailServie;
    private readonly userDetailsService;
    private readonly userRegisterCacheService;
    private readonly matchingSpamService;
    private readonly userBelongingsService;
    constructor(cookieService: CookieService, authService: AuthService, userService: UsersService, jwtService: JwtService, jwtAcessService: JwtAcessService, mailServie: MailService, userDetailsService: UserDetailsServiceService, userRegisterCacheService: UserRegisterCacheService, matchingSpamService: MatchingSpamService, userBelongingsService: UserBelongingsService);
    login(body: UserLoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    register(body: UserRegisterDto): Promise<{
        checkedLolCreds: {
            level: number;
            profileImageId: number;
            league: import("../common/enum/lol_league.enum").LolLeague;
            league_number: number;
            league_points: number;
            win_rate: number;
        };
        check: boolean;
    }>;
    registerVerify(id: number, req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    checkIfAuth(): Promise<boolean>;
    getAccessToken(request: Request): Promise<any>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(body: ForgotPasswordRequestDto): Promise<{
        token: string;
        msg?: undefined;
    } | {
        token: string;
        msg: string;
    }>;
    forgotPasswordUpdate(body: ForgotPasswordConfirmRequestDto, req: ForgotPasswordRequest): Promise<{
        msg: string;
    }>;
}
