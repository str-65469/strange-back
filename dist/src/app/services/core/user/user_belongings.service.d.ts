import { Repository } from 'typeorm';
import { UserBelongings } from 'src/database/entity/user_belongings.entity';
import User from 'src/database/entity/user.entity';
export declare class UserBelongingsService {
    private readonly userBelongingsRepo;
    constructor(userBelongingsRepo: Repository<UserBelongings>);
    find(userId: number): Promise<UserBelongings>;
    create(user: User): Promise<UserBelongings>;
    update(userId: number, amount: number): Promise<UserBelongings>;
    decreaseSuperLike(userId: number, amount: number): Promise<UserBelongings>;
}
