import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRegisterCacheService } from 'src/app/services/core/user/user_register_cache.service';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';
import { AuthService } from 'src/app/services/core/auth/auth.service';

@Injectable()
export class JwtRegisterAuthGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtAcessService: JwtAcessService,
    private readonly userRegisterCacheService: UserRegisterCacheService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // validate parameters
    ['id', 'secret'].forEach((param) => {
      if (!request.query[param]) {
        throw new BadRequestException(`query parameter {${param}} is missing`);
      }
    });

    const { id, secret } = request.query;

    // first check if in register cache
    const cachedData = await this.authService.retrieveRegisterCachedData(id);

    // if secret and cached secret is not exactly same
    if (secret !== cachedData.secret_token) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.jwtAcessService.validateToken({
      token: secret,
      secret: process.env.JWT_REGISTER_CACHE_SECRET,
      expired_clbck: () => this.userRegisterCacheService.delete(id),
    });

    return true;
  }
}
