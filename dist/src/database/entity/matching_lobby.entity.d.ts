import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';
export declare class MatchingLobby extends GeneralEntity {
    user: User;
    likedUser: User;
}
