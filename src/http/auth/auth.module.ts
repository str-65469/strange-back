import { MatchingSpamService } from '../../app/matching_spam/matchingspamservice.service';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { UserDetailsServiceService } from '../user_details/user_details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './../../mail/mail.module';
import { JwtAcessService } from './../jwt/jwt-access.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { UserRegisterCacheService } from '../user_register_cache/user_register_cache.service';
import UserDetails from 'src/database/entity/user_details.entity';

@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    TypeOrmModule.forFeature([UserRegisterCache, UserDetails, MatchingSpams]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAcessService,
    UserDetailsServiceService,
    UserRegisterCacheService,
    MatchingSpamService,
  ],
  exports: [AuthService, JwtAcessService],
})
export class AuthModule {}
