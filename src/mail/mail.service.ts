import { UserRegisterCache } from './../database/entity/user_register_cache';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(userCached: UserRegisterCache) {
    const url = `http://localhost?id=saisjaos1j2io3j12ioj`;

    await this.mailerService.sendMail({
      to: 'giorgi.kumelashvili21@gmail.com',
      from: 'giorgi.kumelashvili21@gmail.com',

      //   to: userCached.emailD,
      //   from: 'giorgi.kumelashvili21@gmail.com',

      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        name: userCached.username,
        url,
      },
    });
  }
}
