import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GeneralException } from 'src/exceptions/general.exception';
import { MessageCode } from 'src/enum/exceptions/general_exception.enum';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAcessTokenAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookies = request.cookies;
    const accessToken = cookies?.access_token;

    if (!accessToken) {
      throw new UnauthorizedException('access token is missing');
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err: jwt.VerifyErrors) => {
      if (err) {
        if (err.name === MessageCode.TOKEN_EXPIRED) {
          throw new GeneralException(
            {
              message: 'access token has been expired',
              status_code: HttpStatus.UNAUTHORIZED,
              message_code: MessageCode.TOKEN_EXPIRED,
              detailed: err,
            },
            HttpStatus.UNAUTHORIZED,
          );
        }

        throw new GeneralException(
          {
            message: err.message,
            status_code: HttpStatus.UNAUTHORIZED,
            message_code: MessageCode.GENERAL,
            detailed: err,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    });

    return true;
  }
}
