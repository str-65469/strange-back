import { JwtAcessService, AccessTokenPayload } from './../../http/jwt/jwt-access.service';
import { Logger, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { configs } from 'src/configs';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { JwtAcessTokenAuthGuard } from 'src/http/auth/guards/jwt-access.guard';

@WebSocketGateway()
export class DuoMatchGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private wss: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(private readonly jwtAccessService: JwtAcessService, private readonly jwtService: JwtService) {}

  afterInit() {
    this.logger.log('Duo match socket Initialized');
  }

  handleConnection(socket: Socket): void {
    this.logger.log(`Client connected ${socket.id}`);
  }

  @SubscribeMessage(configs.socket.duomatchConnect)
  handleEvent(@ConnectedSocket() socket: Socket): string {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    const token = cookies?.access_token;
    this.jwtAccessService.validateToken({ token, secret: process.env.JWT_SECRET });

    const accessTokenDecoded = this.jwtService.decode(token) as AccessTokenPayload;
    const socketId = accessTokenDecoded.socket_id;

    this.logger.log(
      `User ${accessTokenDecoded.username} joined private socked with socket id of ${socketId}`,
    );

    socket.join(socketId);

    // send found user and if anyone matched
    this.wss.sockets.in(socketId).emit('duo_match_finder', { msg: 'testing' });

    return 'joined';
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }
}
