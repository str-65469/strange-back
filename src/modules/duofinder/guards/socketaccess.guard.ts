import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToWs();
    const token = request.getClient().handshake?.auth?.token;

    if (!token) {
      throw new WsException('Token missing');
    }

    return true;
  }
}
