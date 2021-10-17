import { ConfigModule } from '@nestjs/config';
import { RegisterMailCheckService } from './services/register_check.service';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ContactUsMailService } from './services/contact_us.service';

@Module({
  imports: [
    // ConfigModule.forRoot(),
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
        dir: join(__dirname, '../../mail/templates'),
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
  ],
  exports: [MailService],
})
export class MailModule {}
