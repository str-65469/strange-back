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
import { ContactUsService } from './app_services/contact_us/contact_us.service';
import { ContactUs } from './database/entity/contact_us.entity';
import { AppGateway } from './general.gateway';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([ContactUs]),
    MulterModule.register({
      dest: './upload',
    }),
    UsersModule,
    AuthModule,
    MailModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService, ContactUsService, AppGateway],
  exports: [],
})
export class AppModule {}
