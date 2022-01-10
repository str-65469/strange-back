import { CanActivate, ExecutionContext } from '@nestjs/common';
import { CookieService } from 'src/app/services/common/cookie.service';
import { AccessTokenPayload, JwtAcessService } from 'src/app/services/common/jwt_access.service';
import { Request } from 'express';
export interface JwtRequest extends Request {
    jwtPayload: AccessTokenPayload;
}
export declare class JwtAcessTokenAuthGuard implements CanActivate {
    private readonly jwtAcessService;
    private readonly cookieService;
    constructor(jwtAcessService: JwtAcessService, cookieService: CookieService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
