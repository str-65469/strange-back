import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SENDER_ADDRESS } from '../mail.service';

@Injectable()
export class ForgotPasswordMailService {
  constructor(private mailerService: MailerService) {}

  public async sendConfirmationEmail(to: string, properties: { uuid: string; username: string }): Promise<any> {
    return await this.mailerService
      .sendMail({
        from: SENDER_ADDRESS,
        to: to,
        subject: 'Forgot password Strangeelo',
        template: './forgot_password', // `.hbs` extension is appended automatically
        context: properties,
      })
      .catch((err) => {
        console.log('Forgot password Service Error');
        console.log(err);
      });
  }
}
