import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';
export declare class UserBelongings extends GeneralEntity {
    super_like?: number;
    userId: number;
    user: User;
}
