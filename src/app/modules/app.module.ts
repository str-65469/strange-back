import * as path from 'path';
import { BillingModule } from './billing.module';
import { ReportsController } from '../controllers/reports.controller';
import { MatchedDuosController } from '../controllers/matched_duos.controller';
import { NotificationsController } from '../controllers/notifications.controller';
import { SeederModule } from '../../database/seeders/seeder.module';
import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from '../../configs/typeorm';
import { UsersModule } from './users.module';
import { MulterModule } from '@nestjs/platform-express';
import { RouterModule } from '@nestjs/core';
import { SuperLikeController } from '../controllers/superlike.controller';
import { ContactUsService } from './non_auth/contact_us.service';
import { MatchedDuosService } from './user/matched_duos.service';
import { MatchingLobbyService } from './user/matching_lobby.service';
import { NotificationsService } from './non_auth/notifications.service';
import { ReportsService } from './non_auth/reports.service';
import { UserBelongingsService } from './user/user_belongings.service';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CredentialsController } from '../controllers/credentieals.controller';
import { CredentialsService } from './non_auth/credentials.service';
import { ChatModule } from './chat.module';
import { EntitiesModule } from './entities.module';

@Module({
    imports: [
        // defined modules
        UsersModule,
        AuthModule,
        SeederModule,
        BillingModule,
        ChatModule,
        EntitiesModule,

        JwtModule.register({}),
        MulterModule.register({ dest: path.join(__dirname, '../../../../', 'upload') }),
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(TypeormConfig.instance),
        RouterModule.register([
            {
                path: 'billing',
                module: BillingModule,
            },
        ]),
    ],
    controllers: [
        MatchedDuosController,
        NotificationsController,
        AppController,
        ReportsController,
        SuperLikeController,
        CredentialsController,
    ],
    providers: [
        UserBelongingsService,
        MatchingLobbyService,
        MatchedDuosService,
        NotificationsService,
        ContactUsService,
        ReportsService,
        CredentialsService,
    ],
    exports: [],
})
export class AppModule {}
