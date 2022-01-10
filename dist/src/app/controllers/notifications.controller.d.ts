import { Request } from 'express';
import { NotificationsService } from '../services/core/notifications.service';
import { UsersService } from '../services/core/user/users.service';
export declare class NotificationsController {
    private readonly notificationService;
    private readonly userService;
    constructor(notificationService: NotificationsService, userService: UsersService);
    delete(matchId: number): Promise<boolean>;
    updateSeen(matchId: number): Promise<boolean>;
    updateHiddenSeen(req: Request): Promise<boolean>;
}
