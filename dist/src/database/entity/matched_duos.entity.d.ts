import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';
export declare class MatchedDuos extends GeneralEntity {
    is_favorite?: boolean;
    user: User;
    matchedUser: User;
}
