import { Inject, Injectable } from '@nestjs/common';
import { ContactUs } from 'src/database/entity/contact_us.entity';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { ContactUsMailProps, ContactUsMailService } from './services/contact_us.service';
import { RegisterMailCheckService } from './services/register_check.service';

export const SENDER_ADDRESS = `"${process.env.APP_TITLE} 👻" <${process.env.MAIL_USER}>`;

@Injectable()
export class MailService {
  constructor(
    @Inject('RegisterMailCheck') private readonly registerMailService: RegisterMailCheckService,
    @Inject('ContactUsMail') private readonly contactUsMailService: ContactUsMailService,
  ) {}

  async sendUserConfirmation(userCached: UserRegisterCache) {
    const { id, username, secret_token } = userCached;

    const properties = {
      url: process.env.APP_URL + `/auth/register/confirm?id=${id}&secret=${secret_token}`,
      username,
    };

    return await this.registerMailService.sendConfirmationEmail(userCached, properties);
  }

  async sendContactEmail(contactUsObj: ContactUs) {
    const mailTemplateProps: ContactUsMailProps = {
      email: contactUsObj.email,
      message_type: contactUsObj.message_type,
      message: contactUsObj?.message,
    };

    return await this.contactUsMailService.sendConfirmationEmail(contactUsObj, mailTemplateProps);
  }
}
