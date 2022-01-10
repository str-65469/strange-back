import { MailerService } from '@nestjs-modules/mailer';
export declare class ForgotPasswordMailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendConfirmationEmail(to: string, properties: {
        uuid: string;
        username: string;
    }): Promise<any>;
}
