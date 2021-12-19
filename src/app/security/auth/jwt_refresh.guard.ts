import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { configs } from 'src/configs/config';
import { CookieService } from 'src/app/services/common/cookie.service';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';
import { UsersService } from 'src/app/services/core/user/users.service';

@Injectable()
export class JwtRefreshTokenAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAcessService: JwtAcessService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly cookieService: CookieService,
  ) {}

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
      throw new UnauthorizedException(configs.messages.exceptions.accessTokenMissing);
    }

    if (!refreshToken) {
      this.cookieService.clearCookie(response);
      throw new UnauthorizedException(configs.messages.exceptions.refreshTokenMissing);
    }

    const accessTokenDecoded = this.jwtService.decode(accessToken) as { id: number; email: string };
    const id = accessTokenDecoded.id;
    const user = await this.userService.findOne(id);
    const secret = user?.secret;

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // validate refresh token
    return this.jwtAcessService.validateToken({
      token: refreshToken,
      secret: secret,
      expired_message: configs.messages.exceptions.refreshTokenExpired,
    });
  }
}
