import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';
export declare class MatchingSpams extends GeneralEntity {
    accept_list: Array<number>;
    decline_list: Array<number>;
    remove_list: Array<number>;
    matched_list: Array<number>;
    user: User;
}
