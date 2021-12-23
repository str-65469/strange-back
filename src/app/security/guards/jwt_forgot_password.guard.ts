import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/app/services/core/auth/auth.service';
import { Request } from 'express';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';
import { configs } from 'src/configs/config';
import { ForgotPasswordCache } from 'src/database/entity/forgot_password_cache.entity';

export interface ForgotPasswordRequest extends Request {
  forgotPasswordCache: ForgotPasswordCache;
}

@Injectable()
export class JwtForgotPasswordAuthGuard {
  constructor(private readonly authService: AuthService, private readonly jwtAcessService: JwtAcessService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<ForgotPasswordRequest>();

    // token validation
    const token = this.jwtAcessService.getForgotPasswordToken(request.headers);

    if (!token) {
      throw new UnauthorizedException(configs.messages.exceptions.forgotPasswordTokenMissing);
    }

    const tokenDecoded = this.jwtAcessService.jwtService.decode(token) as { id: number };
    const cacheId = tokenDecoded?.id;

    // this prcess is needed because secret is saved in database
    if (!tokenDecoded) {
      throw new UnauthorizedException('invalid token');
    }

    if (Object.values(tokenDecoded).length === 0) {
      throw new UnauthorizedException('token doesnt have payload');
    }

    if (!cacheId) {
      throw new UnauthorizedException('token is missing parameter id');
    }

    // retrieve from cache
    const cachedData = await this.authService.retrieveForgotPasswordCachedData(cacheId);

    if (cachedData.secret_token !== token) {
      throw new UnauthorizedException('detected different token for forgot password');
    }

    // no need for missing token or invalid signature check
    this.jwtAcessService.validateToken({
      secret: cachedData.secret,
      token: cachedData.secret_token,
      expired_message: configs.messages.exceptions.forgotPasswordTokenExpired,
      expired_clbck: () => {
        this.authService.userForgotPasswordCacheService.delete(cacheId);
        throw new UnauthorizedException(configs.messages.exceptions.forgotPasswordTokenExpired);
      },
    });

    request.forgotPasswordCache = cachedData;

    return true;
  }
}
