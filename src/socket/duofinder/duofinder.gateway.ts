import { DuoFinderService } from './duo_finder.service';
import { SocketUserService } from './../user/socket_user.service';
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { configs } from 'src/configs';
import { Server, Socket } from 'socket.io';
import { DuoFinderResponseType } from './responses';

const { duomatchConnect, duomatchFind } = configs.socket;

@WebSocketGateway()
export class DuoMatchGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private wss: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly socketUserService: SocketUserService,
    private readonly duoFinderService: DuoFinderService,
  ) {}

  afterInit() {
    this.logger.log('Duo match socket Initialized');
  }

  handleConnection(socket: Socket): void {
    this.logger.log(`Client connected ${socket.id}`);
  }

  @SubscribeMessage(duomatchConnect)
  handleDuoConnect(@ConnectedSocket() socket: Socket) {
    const payload = this.socketUserService.getUserPayload(socket);

    // joi to user specific id
    socket.join(payload.socket_id);

    // send found user and if anyone matched
    return this.duoFinderService.initFirstMatch(payload);
  }

  @SubscribeMessage(duomatchFind)
  handleDuoFind(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    const { id, socket_id } = this.socketUserService.getUserPayload(socket);

    // find which user was this socket requested to by {id}

    // check accept/decline logic

    // find users or matched
    const foundUser = this.duoFinderService.findDuo();
    const foundMatch = this.duoFinderService.findMatch();
    const { MATCH_FOUND, MATCH_NOT_FOUND } = DuoFinderResponseType;

    this.wss.sockets.in(socket_id).emit('duo_match_finder', {
      type: foundMatch ? MATCH_FOUND : MATCH_NOT_FOUND,
      user: foundUser,
      matched_user: foundMatch,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }
}
