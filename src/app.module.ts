import { ReportsService } from './app/reports/reports.service';
import { ReportsController } from './app/reports/reports.controller';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosController } from './app/matched_duos/matchedduos.controller';
import { MatchedDuosService } from './app/matched_duos/matchedduos.service';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { NotificationsService } from './app/notifications/notifications.service';
import { NotificationsController } from './app/notifications/notifications.controller';
import { AccountAbuseReport } from './database/entity/account_abuse_reports.entity';
import { SocketModule } from './socket/socket.module';
import { SeederModule } from './database/seeders/seeder.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config.service';
import { UsersModule } from './http/user/users.module';
import { AuthModule } from './http/auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ContactUsService } from './app/contact_us/contact_us.service';
import { MulterModule } from '@nestjs/platform-express';
import { ContactUs } from './database/entity/contact_us.entity';
import User from './database/entity/user.entity';
import { ResponseBody } from './shared/res/response_body';

@Module({
  imports: [
    SocketModule,
    MulterModule.register({ dest: './upload' }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([ContactUs, MatchedDuosNotifications, MatchedDuos, User, AccountAbuseReport]),
    UsersModule,
    AuthModule,
    MailModule,
    SeederModule,
  ],
  controllers: [MatchedDuosController, NotificationsController, AppController, ReportsController],
  providers: [
    MatchedDuosService,
    NotificationsService,
    AppService,
    ContactUsService,
    ReportsService,
    ResponseBody,
  ],
  exports: [],
})
export class AppModule {}
