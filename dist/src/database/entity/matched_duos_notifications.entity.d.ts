import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';
export declare class MatchedDuosNotifications extends GeneralEntity {
    is_seen: boolean;
    is_hidden_seen: boolean;
    userId: number;
    user: User;
    matchedUser: User;
}
