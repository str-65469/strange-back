import { JwtAcessService } from '../../../services/common/jwt-access.service';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Res } from '@nestjs/common';
import { Observable } from 'rxjs';
import { configs } from 'src/configs';
import { Response } from 'express';
import { CookieService } from 'src/app/services/common/cookie.service';

@Injectable()
export class JwtAcessTokenAuthGuard implements CanActivate {
  constructor(private readonly jwtAcessService: JwtAcessService, private readonly cookieService: CookieService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();

    // get tokens and response
    const cookies = http.getRequest().cookies;
    const response = http.getResponse();
    const accessToken = cookies?.access_token;
    const refreshToken = cookies?.refresh_token;

    // check both token existence
    if (!accessToken) {
      this.cookieService.clearCookie(response);
      throw new UnauthorizedException(configs.messages.exceptions.accessTokenMissing);
    }

    if (!refreshToken) {
      this.cookieService.clearCookie(response);
      throw new UnauthorizedException(configs.messages.exceptions.refreshTokenMissing);
    }

    // validating access token
    return this.jwtAcessService.validateToken({
      token: accessToken,
      secret: process.env.JWT_SECRET,
      expired_message: configs.messages.exceptions.accessTokenExpired,
    });
  }
}
