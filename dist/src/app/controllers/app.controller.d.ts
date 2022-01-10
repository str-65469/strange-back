import { ContactUsService } from '../services/core/contact_us.service';
import { ContactUsDto } from '../common/request/contact_us.dto';
export declare class AppController {
    private readonly contactUsService;
    constructor(contactUsService: ContactUsService);
    test(): string;
    contactUs(body: ContactUsDto): Promise<import("../../database/entity/contact_us.entity").ContactUs>;
}
