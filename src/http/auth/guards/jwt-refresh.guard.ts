import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { configs } from 'src/configs';
import { JwtAcessService } from 'src/http/jwt/jwt-access.service';
import { UsersService } from 'src/http/user/users.service';

@Injectable()
export class JwtRefreshTokenAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAcessService: JwtAcessService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  //   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const cookies = request.cookies;
    const refreshToken = cookies?.refresh_token;
    const accessToken = cookies?.access_token;

    if (!refreshToken) {
      throw new UnauthorizedException(configs.messages.exceptions.refreshTokenMissing);
    }
    if (!accessToken) {
      throw new UnauthorizedException(configs.messages.exceptions.accessTokenMissing);
    }

    const accessTokenDecoded = this.jwtService.decode(accessToken) as { id: number; email: string };
    const id = accessTokenDecoded.id;
    const user = await this.userService.findOne(id);
    const secret = user.secret;

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.jwtAcessService.validateToken({
      token: refreshToken,
      secret: secret,
      expired_message: configs.messages.exceptions.refreshTokenExpired,
    });
  }
}
