import { ExecutionContext } from '@nestjs/common';
import { AuthService } from 'src/app/services/core/auth/auth.service';
import { Request } from 'express';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';
import { ForgotPasswordCache } from 'src/database/entity/forgot_password_cache.entity';
export interface ForgotPasswordRequest extends Request {
    forgotPasswordCache: ForgotPasswordCache;
}
export declare class JwtForgotPasswordAuthGuard {
    private readonly authService;
    private readonly jwtAcessService;
    constructor(authService: AuthService, jwtAcessService: JwtAcessService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getCacheIdFromToken;
}
