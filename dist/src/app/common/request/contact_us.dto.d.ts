import { ContactUseMessageTypes } from 'src/app/common/enum/contact_us_message_type.enum';
export declare class ContactUsDto {
    name: string;
    email: string;
    message_type: ContactUseMessageTypes;
    message?: string;
}
