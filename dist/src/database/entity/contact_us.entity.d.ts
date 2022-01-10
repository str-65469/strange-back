import { ContactUseMessageTypes } from '../../app/common/enum/contact_us_message_type.enum';
import { GeneralEntity } from '../entity_inheritance/general';
export declare class ContactUs extends GeneralEntity {
    name: string;
    email: string;
    message?: string;
    message_type: ContactUseMessageTypes;
}
