/// <reference types="multer" />
import { Request } from 'express';
import { UsersService } from '../services/core/user/users.service';
export declare class UserFileController {
    private readonly userService;
    constructor(userService: UsersService);
    uploadProfileImage(file: Express.Multer.File, req: Request): Promise<import("../../database/entity/user.entity").default>;
}
