import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingLobbyService } from './app/core/matching_lobby/matchinglobby.service';
import { ReportsService } from './app/core/reports/reports.service';
import { ReportsController } from './app/core/reports/reports.controller';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosController } from './app/core/matched_duos/matchedduos.controller';
import { MatchedDuosService } from './app/core/matched_duos/matchedduos.service';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { NotificationsService } from './app/core/notifications/notifications.service';
import { NotificationsController } from './app/core/notifications/notifications.controller';
import { AccountAbuseReport } from './database/entity/account_abuse_reports.entity';
import { SeederModule } from './database/seeders/seeder.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config.service';
import { UsersModule } from './modules/user/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ContactUsService } from './app/core/contact_us/contact_us.service';
import { MulterModule } from '@nestjs/platform-express';
import { ContactUs } from './database/entity/contact_us.entity';
import { ResponseBody } from './app/shared/res/response_body';
import { UserDetails } from './database/entity/user_details.entity';
import { SocketModule } from './modules/duofinder/socket.module';
import User from './database/entity/user.entity';
import { UsersService } from './modules/user/services/users.service';

@Module({
  imports: [
    SocketModule,
    MulterModule.register({ dest: './upload' }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([
      ContactUs,
      MatchedDuosNotifications,
      MatchedDuos,
      User,
      UserDetails,
      AccountAbuseReport,
      MatchingLobby,
    ]),
    UsersModule,
    AuthModule,
    MailModule,
    SeederModule,
  ],
  controllers: [MatchedDuosController, NotificationsController, AppController, ReportsController],
  providers: [
    MatchingLobbyService,
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
