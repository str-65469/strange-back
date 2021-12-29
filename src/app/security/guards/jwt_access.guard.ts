import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { CookieService } from 'src/app/services/common/cookie.service';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';
import { GenericException } from 'src/app/common/exceptions/general.exception';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';

@Injectable()
export class JwtAcessTokenAuthGuard implements CanActivate {
  constructor(private readonly jwtAcessService: JwtAcessService, private readonly cookieService: CookieService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();

    // get tokens and response
    const cookies = http.getRequest().cookies;
    const response = http.getResponse();
    const accessToken = cookies?.access_token;
    const refreshToken = cookies?.refresh_token;

    // check both token existence
    if (!accessToken) {
      this.cookieService.clearCookie(response);
      throw new GenericException(HttpStatus.UNAUTHORIZED, ExceptionMessageCode.ACCESS_TOKEN_MISSING);
    }

    if (!refreshToken) {
      this.cookieService.clearCookie(response);
      throw new GenericException(HttpStatus.UNAUTHORIZED, ExceptionMessageCode.REFRESH_TOKEN_MISSING);
    }

    // validating access token
    return this.jwtAcessService.validateToken({
      token: accessToken,
      secret: process.env.JWT_SECRET,
    });
  }
}
