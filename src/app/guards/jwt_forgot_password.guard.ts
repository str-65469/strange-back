import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { Request } from 'express';
import { JwtAcessService } from 'src/app/common/services/jwt_access.service';
import { configs } from 'src/configs/config';
import { ForgotPasswordCache } from 'src/database/entity/forgot_password_cache.entity';
import { GenericException } from 'src/app/common/exceptions/general.exception';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';

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
    const cacheId = this.getCacheIdFromToken(token);

    // retrieve from cache
    const cachedData = await this.authService.retrieveForgotPasswordCachedData(cacheId);

    if (cachedData.secret_token !== token) {
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ExceptionMessageCode.TOKEN_MISMATCH_ERROR,
        configs.messages.exceptions.forgotPasswordTokenMissMatch,
      );
    }

    // no need for missing token or invalid signature check
    await this.jwtAcessService.validateToken({
      secret: cachedData.secret,
      token: cachedData.secret_token,
      expired_clbck: () => {
        this.authService.userForgotPasswordCacheService.delete(cacheId);

        throw new GenericException(
          HttpStatus.UNAUTHORIZED,
          ExceptionMessageCode.TOKEN_EXPIRED_ERROR,
          configs.messages.exceptions.forgotPasswordTokenExpired,
        );
      },
    });

    request.forgotPasswordCache = cachedData;

    return true;
  }

  private getCacheIdFromToken(token: string): number {
    if (!token) {
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ExceptionMessageCode.FORGOT_PASSWORD_TOKEN_MISSING,
        configs.messages.exceptions.forgotPasswordTokenMissing,
      );
    }

    const tokenDecoded = this.jwtAcessService.jwtService.decode(token) as { id: number };
    const cacheId = tokenDecoded?.id;

    // this prcess is needed because secret is saved in database
    if (!tokenDecoded) {
      throw new GenericException(HttpStatus.UNAUTHORIZED, ExceptionMessageCode.TOKEN_ERROR);
    }

    if (Object.values(tokenDecoded).length === 0) {
      throw new GenericException(HttpStatus.UNAUTHORIZED, ExceptionMessageCode.TOKEN_PAYLOAD_MISSING);
    }

    if (!cacheId) {
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ExceptionMessageCode.TOKEN_PARAMETER_MISSING,
        configs.messages.exceptions.forgotPasswordTokenPayloadIdMissing,
      );
    }

    return cacheId;
  }
}
