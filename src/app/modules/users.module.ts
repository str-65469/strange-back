import User from 'src/database/entity/user.entity';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { JwtAcessService } from '../services/common/jwt_access.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { MulterModule } from '@nestjs/platform-express';
import { UserFileController } from '../controllers/user_files.controller';
import { HttpModule } from '@nestjs/axios';
import { MailModule } from 'src/app/mail/mail.module';
import { CookieService } from 'src/app/services/common/cookie.service';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matching_spam.service';
import { UserController } from 'src/app/controllers/user.controller';
import { UsersService } from 'src/app/services/core/user/users.service';
import { configs } from 'src/configs/config';
import { UserBelongings } from 'src/database/entity/user_belongings.entity';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User, UserDetails, UserBelongings, UserRegisterCache, MatchingSpams]),
    JwtModule.register({ secret: process.env.JWT_REGISTER_CACHE_SECRET }),
    MulterModule.register({ dest: './upload' }),
    HttpModule.register({ baseURL: configs.general.routes.CHECKED_SERVER_URL, timeout: 10000 }), // 10 sec
  ],
  controllers: [UserController, UserFileController],
  providers: [UsersService, JwtAcessService, CookieService, MatchingSpamService],
  exports: [
    TypeOrmModule,
    UsersService,
    JwtAcessService,
    CookieService,
    HttpModule,
    MailModule,
    MatchingSpamService,
  ],
})
export class UsersModule {}
