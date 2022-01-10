import { DuoFinderService } from '../services/core/duo_finder.service';
import { Server, Socket } from 'socket.io';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { DuoFinderResponseType } from '../common/enum/duofinder/duofinder';
import { HandleDuoFindBody } from '../common/schemas/response';
import { UsersService } from '../services/core/user/users.service';
import { ChatService } from '../services/core/chat.service';
export declare class SocketGateway {
    private readonly duoFinderService;
    private readonly userService;
    private readonly userBelongingsService;
    private readonly chatService;
    wss: Server;
    constructor(duoFinderService: DuoFinderService, userService: UsersService, userBelongingsService: UserBelongingsService, chatService: ChatService);
    handleDuoConnect(socket: Socket): Promise<{
        type: DuoFinderResponseType;
        notifications: import("../../database/entity/matched_duos_notifications.entity").MatchedDuosNotifications[];
        found_duo?: undefined;
        found_duo_details?: undefined;
    } | {
        type: DuoFinderResponseType;
        found_duo: import("../../database/entity/user.entity").default;
        found_duo_details: {};
        notifications: import("../../database/entity/matched_duos_notifications.entity").MatchedDuosNotifications[];
    }>;
    handleDuoFind(data: HandleDuoFindBody, socket: Socket): Promise<void>;
}
