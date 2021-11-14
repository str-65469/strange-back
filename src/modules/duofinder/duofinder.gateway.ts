import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { DuoFinderService } from './services/duo_finder.service';
import { UsersService } from 'src/modules/user/services/users.service';
import { Server, Socket } from 'socket.io';
import { configs } from 'src/configs';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { DuoFinderResponseType } from 'src/app/shared/schemas/duofinder/duofinder';
import { HandleDuoFindBody } from 'src/app/shared/schemas/duofinder/response';
import { serialize } from 'class-transformer';

const { duomatchConnect, duomatchFind } = configs.socket;

@WebSocketGateway()
export class DuoMatchGateway {
  @WebSocketServer()
  private wss: Server;

  constructor(private readonly duoFinderService: DuoFinderService, private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SubscribeMessage(duomatchConnect)
  public async handleDuoConnect(@ConnectedSocket() socket: Socket) {
    const { id, socket_id } = this.userService.userSocketPayload(socket);
    const user = await this.userService.userSpamAndDetails(id);

    // join to user specific id
    socket.join(socket_id);

    // send found user and if anyone matched
    return await this.duoFinderService.initFirstMatch(user);
  }

  @SubscribeMessage(duomatchFind)
  public async handleDuoFind(@MessageBody() data: HandleDuoFindBody, @ConnectedSocket() socket: Socket) {
    const payload = this.userService.userSocketPayload(socket);
    const user = await this.userService.userSpamAndDetails(payload.id);
    const prevFound = await this.userService.getUserDetails(data.prevFound.id);

    // check accept/decline logic
    const foundAnyone = await this.duoFinderService.acceptDeclineLogic(user, prevFound, data.type);
    const resp = await this.duoFinderService.findDuo(user, data.prevFound.id);

    if (data && data.prevFound && Object.values(data.prevFound).length == 0) {
      if (foundAnyone) {
        // send to myself
        foundAnyone.type = DuoFinderResponseType.MATCH_FOUND;
        socket.emit('duo_match_finder', JSON.parse(serialize(foundAnyone)));
      }

      socket.emit('duo_match_finder', { type: DuoFinderResponseType.NOBODY_FOUND });
      return;
    }

    if (!resp) {
      if (foundAnyone) {
        // send to myself
        foundAnyone.type = DuoFinderResponseType.MATCH_FOUND;
        socket.emit('duo_match_finder', JSON.parse(serialize(foundAnyone)));
      }

      socket.emit('duo_match_finder', { type: DuoFinderResponseType.NOBODY_FOUND }); //! if nobody was sent from front just return nothing (which means init didnt send any user)
      return;
    }

    if (!foundAnyone) {
      this.wss.sockets.in(payload.socket_id).emit('duo_match_finder', JSON.parse(serialize(resp)));
      return;
    }

    // send to myself
    socket.emit(
      'duo_match_finder',
      JSON.parse(
        serialize({
          type: DuoFinderResponseType.MATCH_FOUND,
          found_duo: prevFound ?? {},
          found_duo_details: prevFound.details ?? {},
        }),
      ),
    );
    socket.emit('duo_match_finder', JSON.parse(serialize(resp)));

    // send to user
    this.wss.sockets.to(prevFound.socket_id).emit('duo_match_finder', JSON.parse(serialize(foundAnyone)));
  }
}
