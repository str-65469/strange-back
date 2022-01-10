import { MailerService } from '@nestjs-modules/mailer';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
export declare class RegisterMailCheckService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendConfirmationEmail(userCached: UserRegisterCache, properties: any): Promise<any>;
}
