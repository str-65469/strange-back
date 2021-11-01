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
import { DuoFinderResponseType, HandleDuoFindBody } from './responses';

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

  handleConnection(): void {
    this.logger.log(`Client connected`);
  }

  @SubscribeMessage(duomatchConnect)
  public async handleDuoConnect(@ConnectedSocket() socket: Socket) {
    const payload = this.socketUserService.getUserPayload(socket);
    this.logger.log(`Client connected ${payload.socket_id}`);

    // join to user specific id
    socket.join(payload.socket_id);

    // get detailed user
    const userDetaled: UserCombined = await this.socketUserService.findFullDetailed(payload.id);

    // send found user and if anyone matched
    return await this.duoFinderService.initFirstMatch(userDetaled);
  }

  @SubscribeMessage(duomatchFind)
  public async handleDuoFind(@MessageBody() data: HandleDuoFindBody, @ConnectedSocket() socket: Socket) {
    const payload = this.socketUserService.getUserPayload(socket);
    const userDetaled: UserCombined = await this.socketUserService.findFullDetailed(payload.id);

    if (data && data.prevFound && Object.values(data.prevFound).length == 0) {
      socket.emit('duo_match_finder', { type: DuoFinderResponseType.NOBODY_FOUND }); //! if nobody was sent from front just return nothing (which means init didnt send any user)
      return;
    }

    // check accept/decline logic
    const foundAnyone = await this.duoFinderService.acceptDeclineLogic(userDetaled, data);

    // find new user or matched
    const resp = await this.duoFinderService.findDuo(userDetaled, data);

    if (!foundAnyone) {
      this.wss.sockets.in(payload.socket_id).emit('duo_match_finder', resp);
    } else {
      const { userToMyself, myselfToUser } = foundAnyone;

      // send to myself
      socket.emit('duo_match_finder', userToMyself); // send match found
      socket.emit('duo_match_finder', resp); // send new match

      // send to user
      this.wss.sockets.to(userToMyself.found_duo.socket_id).emit('duo_match_finder', myselfToUser);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }
}
