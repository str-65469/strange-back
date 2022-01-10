import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';
export declare class SocketAccessGuard implements CanActivate {
    private readonly jwtAcessService;
    constructor(jwtAcessService: JwtAcessService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
