import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';
export declare class NotificationsService {
    private readonly notificationRepo;
    constructor(notificationRepo: Repository<MatchedDuosNotifications>);
    findOne(id: number): Promise<MatchedDuosNotifications>;
    save(user: User, matchedUser: User): Promise<MatchedDuosNotifications>;
    delete(id: number): Promise<boolean>;
    updateMatchedNotification(id: number): Promise<boolean>;
    updateAllHiddenSeen(userId: number): Promise<import("typeorm").UpdateResult>;
    all(user: User): Promise<MatchedDuosNotifications[]>;
}
