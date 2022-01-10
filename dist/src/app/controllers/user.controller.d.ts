import { Request } from 'express';
import { UsersService } from '../services/core/user/users.service';
import { UserPasswordUpdateDto } from '../common/request/user/user_update_password.dto';
import { UserProfileUpdateDto } from '../common/request/user/user_update.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UsersService);
    user(req: Request): Promise<import("../../database/entity/user.entity").default>;
    userProfileUpdate(req: Request, data: UserProfileUpdateDto): Promise<import("../../database/entity/user.entity").default>;
    updatePassword(req: Request, data: UserPasswordUpdateDto): Promise<import("../../database/entity/user.entity").default>;
}
