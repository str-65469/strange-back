import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactUs } from 'src/database/entity/contact_us.entity';
import { MailService } from 'src/app/modules/mail/mail.service';
import { Repository } from 'typeorm';
import { ContactUsDto } from '../../schemas/request/contact_us.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepo: Repository<ContactUs>,
    private readonly mailService: MailService,
  ) {}

  async contactUs(body: ContactUsDto): Promise<ContactUs> {
    const { name, email, message_type } = body;

    const contactUsObj = new ContactUs();

    contactUsObj.name = name;
    contactUsObj.email = email;
    contactUsObj.message_type = message_type;

    if (body.message) {
      contactUsObj.message = body.message;
    }

    // send email
    await this.mailService.sendContactEmail(contactUsObj);

    return await this.contactUsRepo.save(contactUsObj);
  }
}
