import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(username: string, toMail: string) {
    const url = `http://localhost?id=saisjaos1j2io3j12ioj`;

    await this.mailerService.sendMail({
      to: toMail,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        name: username,
        url,
      },
    });
  }
}
