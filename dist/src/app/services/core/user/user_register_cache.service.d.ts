import { UserRegisterCache } from '../../../../database/entity/user_register_cache.entity';
import { Repository } from 'typeorm';
export declare class UserRegisterCacheService {
    private readonly userRegisterCacheRepo;
    constructor(userRegisterCacheRepo: Repository<UserRegisterCache>);
    delete(id: any): Promise<import("typeorm").DeleteResult>;
    findByEmailOrUsername(email: string, username: string): Promise<UserRegisterCache>;
    findOne(id: number): Promise<UserRegisterCache>;
}
