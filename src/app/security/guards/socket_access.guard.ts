import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';

@Injectable()
export class SocketAccessGuard implements CanActivate {
  constructor(private readonly jwtAcessService: JwtAcessService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToWs();
    const token = request.getClient().handshake?.auth?.token;

    if (!token) {
      throw new WsException('Token missing');
    }

    // validate token (it will neve come here but still needed !!!)
    const jwtPayload = await this.jwtAcessService.validateToken({
      is_socket: true,
      token,
      secret: process.env.JWT_SECRET,
    });

    return true;
  }
}
