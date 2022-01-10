import { MailerService } from '@nestjs-modules/mailer';
import { ContactUs } from 'src/database/entity/contact_us.entity';
import { ContactUseMessageTypes } from 'src/app/common/enum/contact_us_message_type.enum';
export interface ContactUsMailProps {
    email: string;
    message_type: ContactUseMessageTypes;
    message?: string;
}
export declare class ContactUsMailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendConfirmationEmail(contactUs: ContactUs, properties: ContactUsMailProps): Promise<any>;
}
