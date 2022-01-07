import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { DuoFinderService } from '../services/core/duo_finder.service';
import { Server, Socket } from 'socket.io';
import { configs } from 'src/configs/config';
import { UseInterceptors, ClassSerializerInterceptor, UseGuards, UseFilters } from '@nestjs/common';
import { serialize } from 'class-transformer';
import { SocketAccessGuard } from '../security/guards/socket_access.guard';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { DuoFinderResponseType, DuoFinderTransferTypes } from '../common/enum/duofinder/duofinder';
import { HandleDuoFindBody } from '../common/schemas/response';
import { UsersService } from '../services/core/user/users.service';
import { AllSocketExceptionsFilter } from '../common/exception_filters/all_socket_exception.filter';
import { ChatService } from '../services/core/chat.service';

@UseGuards(SocketAccessGuard)
@UseFilters(AllSocketExceptionsFilter)
@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer() public wss: Server;

  constructor(
    private readonly duoFinderService: DuoFinderService,
    private readonly userService: UsersService,
    private readonly userBelongingsService: UserBelongingsService,
    private readonly chatService: ChatService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SubscribeMessage(configs.socket.duomatchConnect)
  public async handleDuoConnect(@ConnectedSocket() socket: Socket) {
    const { id, socket_id } = this.userService.userSocketPayload(socket);
    const user = await this.userService.userSpamAndDetails(id);

    console.log('joined' + socket_id);

    // join to user specific id
    socket.join(socket_id);

    // update online status
    this.userService.updateOnlineStatus(user.id, true);

    // send found user and if anyone matched
    return await this.duoFinderService.initFirstMatch(user);
  }

  @SubscribeMessage(configs.socket.duomatchFind)
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

    if (data && data.prevFound && Object.values(data.prevFound).length == 0) {
      socket.emit('duo_match_finder', { type: DuoFinderResponseType.NOBODY_FOUND });
      return;
    }

    if (data.prevFound.id === user.id) {
      return;
    }

    // check accept/decline logic
    const foundAnyone = await this.duoFinderService.acceptDeclineLogic(user, prevFound, data.type); //! will be ingored on JUST_FIND_ANOTHER

    // new spam
    const userRenewed = await this.userService.userSpamAndDetails(user.id);

    const foundNewMatch = await this.duoFinderService.findDuo(userRenewed, data.prevFound.id);

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

        socket.emit('duo_match_finder', { type: DuoFinderResponseType.NOBODY_FOUND }); // not found must go
        this.wss.sockets.to(prevFound.socket_id).emit('duo_match_finder', JSON.parse(serialize(foundAnyone))); // send to user

        // create chat here
        this.chatService.createChatTables(user.id, prevFound.id);
      }
      // if nobody was sent from front just return nothing (which means init didnt send any user)
      else {
        socket.emit('duo_match_finder', { type: DuoFinderResponseType.NOBODY_FOUND });
      }

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
    // create chat here
    this.chatService.createChatTables(user.id, prevFound.id);
  }
}
