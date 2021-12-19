import * as path from 'path';
import User from '../../database/entity/user.entity';
import { BillingModule } from './billing.module';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { ReportsController } from '../controllers/reports.controller';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosController } from '../controllers/matchedduos.controller';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { NotificationsController } from '../controllers/notifications.controller';
import { AccountAbuseReport } from '../../database/entity/account_abuse_reports.entity';
import { SeederModule } from '../../database/seeders/seeder.module';
import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from '../../configs/typeorm';
import { UsersModule } from './users.module';
import { MailModule } from '../mail/mail.module';
import { MulterModule } from '@nestjs/platform-express';
import { ContactUs } from '../../database/entity/contact_us.entity';
import { UserDetails } from '../../database/entity/user_details.entity';
import { SocketModule } from '../socket/socket.module';
import { RouterModule } from '@nestjs/core';
import { SuperLikeController } from '../controllers/superlike.controller';
import { UserBelongings } from '../../database/entity/user_belongings.entity';
import { ContactUsService } from '../services/core/contact_us/contact_us.service';
import { MatchedDuosService } from '../services/core/matcheds/matchedduos.service';
import { MatchingLobbyService } from '../services/core/matcheds/matchinglobby.service';
import { NotificationsService } from '../services/core/notifications/notifications.service';
import { ReportsService } from '../services/core/reports/reports.service';
import { UserBelongingsService } from '../services/core/user/user_belongings.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    SocketModule,
    MulterModule.register({ dest: path.join(__dirname, '../../../../', 'upload') }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(TypeormConfig.instance),
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
    ContactUsService,
    ReportsService,
  ],
  exports: [],
})
export class AppModule {}
