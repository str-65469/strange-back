import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAcessService } from 'src/http/jwt/jwt-access.service';

@Injectable()
export class JwtAcessTokenAuthGuard implements CanActivate {
  constructor(private readonly jwtAcessService: JwtAcessService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookies = request.cookies;
    const accessToken = cookies?.access_token;

    if (!accessToken) {
      throw new UnauthorizedException('access token is missing');
    }

    return this.jwtAcessService.validateAcessToken(accessToken);
  }
}
