import { ContactUs } from 'src/database/entity/contact_us.entity';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { ContactUsMailService } from './services/contact_us.service';
import { RegisterMailCheckService } from './services/register_check.service';
import { ForgotPasswordMailService } from './services/forgot_password.service';
export declare const SENDER_ADDRESS: string;
export declare class MailService {
    private readonly registerMailService;
    private readonly contactUsMailService;
    private readonly forgotPasswordMailService;
    constructor(registerMailService: RegisterMailCheckService, contactUsMailService: ContactUsMailService, forgotPasswordMailService: ForgotPasswordMailService);
    sendUserConfirmation(userCached: UserRegisterCache): Promise<any>;
    sendForgotPasswordUUID(email: string, uuid: string, username: string): Promise<any>;
    sendContactEmail(contactUsObj: ContactUs): Promise<any>;
}
