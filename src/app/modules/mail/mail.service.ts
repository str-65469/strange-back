import { Inject, Injectable } from '@nestjs/common';
import { ContactUs } from 'src/database/entity/contact_us.entity';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { ContactUsMailProps, ContactUsMailService } from './contact_us.service';
import { RegisterMailCheckService } from './register_check.service';
import * as dotenv from 'dotenv';
import { ForgotPasswordMailService } from './forgot_password.service';
import { createUrl } from '../../utils/url_builder.helper';
import { configs } from 'src/configs/config';
dotenv.config();

export const SENDER_ADDRESS = `"${process.env.APP_TITLE} 👻" <${process.env.MAIL_USER}>`;

@Injectable()
export class MailService {
  constructor(
    @Inject('RegisterMailCheck') private readonly registerMailService: RegisterMailCheckService,
    @Inject('ContactUsMail') private readonly contactUsMailService: ContactUsMailService,
    @Inject('ForgotPasswordMail') private readonly forgotPasswordMailService: ForgotPasswordMailService,
  ) {}

  async sendUserConfirmation(userCached: UserRegisterCache) {
    const { id, username, secret_token } = userCached;

    const url = createUrl(configs.general.routes.APP_URL, {
      path: `/auth/register/confirm?id=${id}&secret=${secret_token}`,
    });

    return this.registerMailService.sendConfirmationEmail(userCached, { url, username });
  }

  async sendForgotPasswordUUID(email: string, uuid: string, username: string) {
    const properties = {
      uuid,
      username,
    };

    return this.forgotPasswordMailService.sendConfirmationEmail(email, properties);
  }

  async sendContactEmail(contactUsObj: ContactUs) {
    const mailTemplateProps: ContactUsMailProps = {
      email: contactUsObj.email,
      message_type: contactUsObj.message_type,
      message: contactUsObj?.message,
    };

    return this.contactUsMailService.sendConfirmationEmail(contactUsObj, mailTemplateProps);
  }
}
