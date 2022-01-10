import { ExecutionContext } from '@nestjs/common';
import { UserRegisterCacheService } from 'src/app/services/core/user/user_register_cache.service';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';
import { AuthService } from 'src/app/services/core/auth/auth.service';
export declare class JwtRegisterAuthGuard {
    private readonly authService;
    private readonly jwtAcessService;
    private readonly userRegisterCacheService;
    constructor(authService: AuthService, jwtAcessService: JwtAcessService, userRegisterCacheService: UserRegisterCacheService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
