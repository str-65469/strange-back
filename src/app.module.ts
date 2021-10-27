import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { NotificationsService } from './app/notifications/notifications.service';
import { NotificationsController } from './app/notifications/notifications.controller';
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

@Module({
  imports: [
    SocketModule,
    MulterModule.register({ dest: './upload' }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([ContactUs, MatchedDuosNotifications]),
    UsersModule,
    AuthModule,
    MailModule,
    SeederModule,
  ],
  controllers: [NotificationsController, AppController],
  providers: [NotificationsService, AppService, ContactUsService],
  exports: [],
})
export class AppModule {}
