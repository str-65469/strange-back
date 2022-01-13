import { JwtAcessService } from '../common/services/jwt_access.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { UserFileController } from '../controllers/user_files.controller';
import { HttpModule } from '@nestjs/axios';
import { MailModule } from 'src/app/modules/mail.module';
import { CookieService } from 'src/app/common/services/cookie.service';
import { MatchingSpamService } from 'src/app/modules/user/matching_spam.service';
import { UserController } from 'src/app/controllers/user.controller';
import { UsersService } from 'src/app/modules/user/users.service';
import { configs } from 'src/configs/config';
import { EntitiesModule } from './entities.module';

@Module({
  imports: [
    MailModule,
    EntitiesModule,
    JwtModule.register({ secret: process.env.JWT_REGISTER_CACHE_SECRET }),
    MulterModule.register({ dest: './upload' }),
    HttpModule.register({ baseURL: configs.general.routes.CHECKED_SERVER_URL, timeout: 10000 }), // 10 sec
  ],
  controllers: [UserController, UserFileController],
  providers: [UsersService, JwtAcessService, CookieService, MatchingSpamService],
  exports: [UsersService, JwtAcessService, CookieService, HttpModule, MailModule, MatchingSpamService],
})
export class UsersModule {}
