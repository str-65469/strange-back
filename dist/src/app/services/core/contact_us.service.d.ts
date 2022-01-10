import { ContactUs } from 'src/database/entity/contact_us.entity';
import { MailService } from 'src/app/mail/mail.service';
import { Repository } from 'typeorm';
import { ContactUsDto } from '../../common/request/contact_us.dto';
export declare class ContactUsService {
    private readonly contactUsRepo;
    private readonly mailService;
    constructor(contactUsRepo: Repository<ContactUs>, mailService: MailService);
    contactUs(body: ContactUsDto): Promise<ContactUs>;
}
