import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RegisterMailCheckService } from './mail/register_check.service';
import { ContactUsMailService } from './mail/contact_us.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail/mail.service';
import { Module } from '@nestjs/common';
import { ForgotPasswordMailService } from './mail/forgot_password.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: JSON.parse(process.env.MAIL_USE_TLS),
        port: JSON.parse(process.env.MAIL_PORT),
        logger: JSON.parse(process.env.MAIL_LOG),
        pool: JSON.parse(process.env.MAIL_POOL),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      template: {
        dir: path.join(__dirname, '../../../../public/mail/templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: { strict: true },
      },
    }),
  ],
  providers: [
    MailService,
    {
      provide: 'RegisterMailCheck',
      useClass: RegisterMailCheckService,
    },
    {
      provide: 'ContactUsMail',
      useClass: ContactUsMailService,
    },
    {
      provide: 'ForgotPasswordMail',
      useClass: ForgotPasswordMailService,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
