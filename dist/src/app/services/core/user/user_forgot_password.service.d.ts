import { Repository } from 'typeorm';
import { ForgotPasswordCache } from 'src/database/entity/forgot_password_cache.entity';
export declare class UserForgotPasswordCacheService {
    private readonly forgotPasswordCacheRepo;
    constructor(forgotPasswordCacheRepo: Repository<ForgotPasswordCache>);
    delete(id: number): Promise<import("typeorm").DeleteResult>;
    findByEmail(email: string): Promise<ForgotPasswordCache>;
    findOne(id: number): Promise<ForgotPasswordCache>;
    save(id: number, email: string, summoner_name: string, uuid: string): Promise<ForgotPasswordCache>;
    update(id: number, token: string, secret: string): Promise<import("typeorm").UpdateResult>;
}
