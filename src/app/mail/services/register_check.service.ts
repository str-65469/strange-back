import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { SENDER_ADDRESS } from '../mail.service';

@Injectable()
export class RegisterMailCheckService {
  constructor(private mailerService: MailerService) {}

  public async sendConfirmationEmail(userCached: UserRegisterCache, properties: any): Promise<any> {
    return await this.mailerService
      .sendMail({
        from: SENDER_ADDRESS,
        to: userCached.email,
        subject: 'Welcome to Strangeelo! Confirm your Email',
        template: './register_confirmation', // `.hbs` extension is appended automatically
        context: properties,
      })
      .catch((err) => {
        console.log('===================[ Register Mail Check Service Error ]');
        console.log(err);
      });
  }
}
