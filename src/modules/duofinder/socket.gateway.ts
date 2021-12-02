import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { DuoFinderService } from './services/duo_finder.service';
import { UsersService } from 'src/modules/user/services/users.service';
import { Server, Socket } from 'socket.io';
import { configs } from 'src/configs';
import { UseInterceptors, ClassSerializerInterceptor, UseGuards, HttpStatus } from '@nestjs/common';
import { DuoFinderResponseType, DuoFinderTransferTypes } from 'src/app/shared/schemas/duofinder/duofinder';
import { HandleDuoFindBody } from 'src/app/shared/schemas/duofinder/response';
import { serialize } from 'class-transformer';
import { SocketAccessGuard } from './guards/socketaccess.guard';
import { UserBelongingsService } from 'src/app/core/user_belongings/user_belongings.service';

const { duomatchConnect, duomatchFind } = configs.socket;

@UseGuards(SocketAccessGuard)
@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  private wss: Server;

  constructor(
    private readonly duoFinderService: DuoFinderService,
    private readonly userService: UsersService,
    private readonly userBelongingsService: UserBelongingsService,
  ) {}

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

    // check if superlike and has superlikes at all ?
    if (data.type === DuoFinderTransferTypes.SUPERLIKE) {
      const check = await this.userBelongingsService.find(user.id);

      if (check.super_like && check.super_like === 0) {
        throw new WsException('not enough superlike');
      }
    }

    // check accept/decline logic
    const foundAnyone = await this.duoFinderService.acceptDeclineLogic(user, prevFound, data.type); //! will be ingored on JUST_FIND_ANOTHER
    const foundNewMatch = await this.duoFinderService.findDuo(user, data.prevFound.id);

    if (data && data.prevFound && Object.values(data.prevFound).length == 0) {
      if (foundAnyone) {
        socket.emit('duo_match_finder', JSON.parse(serialize(foundAnyone)));
      }

      socket.emit('duo_match_finder', { type: DuoFinderResponseType.NOBODY_FOUND });
      return;
    }

    // just find anyone and send (must be here !!!)
    if (data.type === DuoFinderTransferTypes.JUST_FIND_ANOTHER) {
      if (foundNewMatch) {
        socket.emit('duo_match_finder', JSON.parse(serialize(foundNewMatch)));
      } else {
        socket.emit('duo_match_finder', { type: DuoFinderResponseType.NOBODY_FOUND });
      }

      return;
    }

    if (!foundNewMatch) {
      if (foundAnyone) {
        socket.emit('duo_match_finder', JSON.parse(serialize(foundAnyone)));
      }

      // if nobody was sent from front just return nothing (which means init didnt send any user)
      socket.emit('duo_match_finder', { type: DuoFinderResponseType.NOBODY_FOUND });
      return;
    }

    if (!foundAnyone) {
      socket.emit('duo_match_finder', JSON.parse(serialize(foundNewMatch)));
      return;
    }

    // regular match
    if (foundAnyone.type === DuoFinderResponseType.MATCH_FOUND_OTHER) {
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
    }

    // superlike match
    if (foundAnyone.type === DuoFinderResponseType.MATCH_FOUND_OTHER_BY_SUPERLIKE) {
      // decline superlike count of user
      await this.userBelongingsService.decreaseSuperLike(user.id, 1);

      // send to myself
      socket.emit(
        'duo_match_finder',
        JSON.parse(
          serialize({
            type: DuoFinderResponseType.MATCH_FOUND_BY_SUPERLIKE,
            found_duo: prevFound ?? {},
            found_duo_details: prevFound.details ?? {},
          }),
        ),
      );
    }

    socket.emit('duo_match_finder', JSON.parse(serialize(foundNewMatch))); // foun new match as well
    this.wss.sockets.to(prevFound.socket_id).emit('duo_match_finder', JSON.parse(serialize(foundAnyone))); // send to user
  }
}
