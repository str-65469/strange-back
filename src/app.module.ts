import User from './database/entity/user.entity';
import { BillingModule } from './app/modules/billing/billing.module';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { ReportsController } from './app/controllers/reports.controller';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosController } from './app/controllers/matchedduos.controller';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { NotificationsController } from './app/controllers/notifications.controller';
import { AccountAbuseReport } from './database/entity/account_abuse_reports.entity';
import { SeederModule } from './database/seeders/seeder.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config.service';
import { UsersModule } from './app/modules/user/users.module';
import { AuthModule } from './app/modules/auth/auth.module';
import { MailModule } from './mail/mail.module';
import { MulterModule } from '@nestjs/platform-express';
import { ContactUs } from './database/entity/contact_us.entity';
import { ResponseBody } from './app/common/res/response_body';
import { UserDetails } from './database/entity/user_details.entity';
import { SocketModule } from './app/modules/duofinder/socket.module';
import { RouterModule } from '@nestjs/core';
import { SuperLikeController } from './app/controllers/superlike.controller';
import { UserBelongings } from './database/entity/user_belongings.entity';
import { ContactUsService } from './app/services/core/contact_us/contact_us.service';
import { MatchedDuosService } from './app/services/core/matcheds/matchedduos.service';
import { MatchingLobbyService } from './app/services/core/matcheds/matchinglobby.service';
import { NotificationsService } from './app/services/core/notifications/notifications.service';
import { ReportsService } from './app/services/core/reports/reports.service';
import { UserBelongingsService } from './app/services/core/user/user_belongings.service';

@Module({
  imports: [
    SocketModule,
    MulterModule.register({ dest: './upload' }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ConfigService.instance),
    TypeOrmModule.forFeature([
      ContactUs,
      MatchedDuosNotifications,
      MatchedDuos,
      User,
      UserDetails,
      AccountAbuseReport,
      MatchingLobby,
      UserBelongings,
    ]),

    // defined modules
    UsersModule,
    AuthModule,
    MailModule,
    SeederModule,
    BillingModule,

    RouterModule.register([
      {
        path: 'billing',
        module: BillingModule,
      },
    ]),
  ],
  controllers: [MatchedDuosController, NotificationsController, AppController, ReportsController, SuperLikeController],
  providers: [
    UserBelongingsService,
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
