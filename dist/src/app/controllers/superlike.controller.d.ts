import { Request } from 'express';
import { UsersService } from '../services/core/user/users.service';
import { UserBelongingsService } from '../services/core/user/user_belongings.service';
export declare class SuperLikeController {
    private readonly userService;
    private readonly userBelongingsService;
    constructor(userService: UsersService, userBelongingsService: UserBelongingsService);
    fetchSuperLike(req: Request): Promise<{
        count: number;
    }>;
}
