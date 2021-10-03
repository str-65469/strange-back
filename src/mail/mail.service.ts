import { Inject, Injectable } from '@nestjs/common';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { RegisterMailCheckService } from './register/register_check.service';

export const SENDER_ADDRESS = `"${process.env.APP_TITLE} 👻" <${process.env.MAIL_USER}>`;

@Injectable()
export class MailService {
  constructor(
    @Inject('RegisterMailCheck')
    private readonly registerMailService: RegisterMailCheckService,
  ) {}

  async sendUserConfirmation(userCached: UserRegisterCache) {
    const { id, username, secret_token } = userCached;

    const properties = {
      url: process.env.APP_URL + `/auth/register/confirm?id=${id}&secret=${secret_token}`,
      username,
    };

    return await this.registerMailService.sendConfirmationEmail(userCached, properties);
  }
}
