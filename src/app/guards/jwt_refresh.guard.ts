import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { configs } from 'src/configs/config';
import { CookieService } from 'src/app/common/services/cookie.service';
import { JwtAcessService } from 'src/app/common/services/jwt_access.service';
import { UsersService } from 'src/app/modules/user/users.service';
import { GenericException } from 'src/app/common/exceptions/general.exception';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';

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
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ExceptionMessageCode.ACCESS_TOKEN_MISSING,
        configs.messages.exceptions.accessTokenMissing,
      );
    }

    if (!refreshToken) {
      this.cookieService.clearCookie(response);
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ExceptionMessageCode.REFRESH_TOKEN_MISSING,
        configs.messages.exceptions.refreshTokenMissing,
      );
    }

    const accessTokenDecoded = this.jwtService.decode(accessToken) as { id: number; email: string };
    const id = accessTokenDecoded.id;
    const user = await this.userService.findOne(id);
    const secret = user?.secret;

    if (!user) {
      throw new GenericException(HttpStatus.NOT_FOUND, ExceptionMessageCode.USER_NOT_FOUND);
    }

    // validate refresh token
    const jwtPayload = await this.jwtAcessService.validateToken({
      token: refreshToken,
      secret: secret,
    });

    return true;
  }
}
