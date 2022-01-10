import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieService } from 'src/app/services/common/cookie.service';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';
import { UsersService } from 'src/app/services/core/user/users.service';
export declare class JwtRefreshTokenAuthGuard implements CanActivate {
    private readonly jwtAcessService;
    private readonly jwtService;
    private readonly userService;
    private readonly cookieService;
    constructor(jwtAcessService: JwtAcessService, jwtService: JwtService, userService: UsersService, cookieService: CookieService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
