import { DuoFinderService, UserCombined } from './duo_finder.service';
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
import { HandleDuoFindBody } from './responses';

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
  public async handleDuoConnect(@ConnectedSocket() socket: Socket) {
    const payload = this.socketUserService.getUserPayload(socket);

    // join to user specific id
    socket.join(payload.socket_id);

    // get detailed user
    const userDetaled: UserCombined = await this.socketUserService.findFullDetailed(payload.id);

    // send found user and if anyone matched
    return await this.duoFinderService.initFirstMatch(userDetaled);
  }

  @SubscribeMessage(duomatchFind)
  public async handleDuoFind(@MessageBody() data: HandleDuoFindBody, @ConnectedSocket() socket: Socket) {
    console.log('==================');

    const payload = this.socketUserService.getUserPayload(socket);

    // get detailed user
    const userDetaled: UserCombined = await this.socketUserService.findFullDetailed(payload.id);

    // check accept/decline logic
    const foundAnyone = await this.duoFinderService.acceptDeclineLogic(userDetaled, data);

    if (!foundAnyone) {
      // find new user or matched
      const resp = await this.duoFinderService.findDuo(userDetaled, data);

      this.wss.sockets.in(payload.socket_id).emit('duo_match_finder', resp);
    } else {
      // send to myself and user
      this.wss.sockets.in(payload.socket_id).emit('duo_match_finder', foundAnyone.foundUser); // myself
      this.wss.sockets
        .in(foundAnyone.myselfUser.found_duo.socket_id)
        .emit('duo_match_finder', foundAnyone.myselfUser); // to user
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }
}
