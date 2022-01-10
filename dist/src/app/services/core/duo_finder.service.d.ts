import User from 'src/database/entity/user.entity';
import { MatchingLobbyService } from 'src/app/services/core/matcheds/matching_lobby.service';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matching_spam.service';
import { DuoFinderResponseType, DuoFinderTransferTypes } from 'src/app/common/enum/duofinder/duofinder';
import { UsersService } from './user/users.service';
import { NotificationsService } from './notifications.service';
import { MatchedDuosService } from './matcheds/matched_duos.service';
export declare class DuoFinderService {
    private readonly matchedDuosService;
    private readonly lobbyService;
    private readonly notificationService;
    private readonly spamService;
    private readonly userService;
    constructor(matchedDuosService: MatchedDuosService, lobbyService: MatchingLobbyService, notificationService: NotificationsService, spamService: MatchingSpamService, userService: UsersService);
    initFirstMatch(user: User): Promise<{
        type: DuoFinderResponseType;
        notifications: import("../../../database/entity/matched_duos_notifications.entity").MatchedDuosNotifications[];
        found_duo?: undefined;
        found_duo_details?: undefined;
    } | {
        type: DuoFinderResponseType;
        found_duo: User;
        found_duo_details: {};
        notifications: import("../../../database/entity/matched_duos_notifications.entity").MatchedDuosNotifications[];
    }>;
    findDuo(user: User, prevFoundId: number): Promise<{
        type: DuoFinderResponseType;
        found_duo_details: {};
        found_duo: User;
    }>;
    acceptDeclineLogic(user: User, prevFound: User, type: DuoFinderTransferTypes): Promise<{
        type: DuoFinderResponseType;
        found_duo_details: {};
        found_duo: User;
        notification: import("../../../database/entity/matched_duos_notifications.entity").MatchedDuosNotifications;
    }>;
}
