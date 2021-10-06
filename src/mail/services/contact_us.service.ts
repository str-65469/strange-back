import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ContactUs } from 'src/database/entity/contact_us.entity';
import { ContactUseMessageTypes } from 'src/enum/contact_us_message_type.enum';

export interface ContactUsMailProps {
  email: string;
  message_type: ContactUseMessageTypes;
  message?: string;
}

@Injectable()
export class ContactUsMailService {
  constructor(private mailerService: MailerService) {}

  public async sendConfirmationEmail(contactUs: ContactUs, properties: ContactUsMailProps): Promise<any> {
    return await this.mailerService
      .sendMail({
        from: contactUs.name,
        to: process.env.MAIL_USER,
        subject: 'Contact Us Strangeelo',
        template: './contact_us', // `.hbs` extension is appended automatically
        context: properties,
      })
      .catch((err) => {
        console.log('===================[ Contact Us Service Error ]');
        console.log(err);
      });
  }
}
