import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserBelongingsService } from 'src/app/modules/user/user_belongings.service';
import { MatchingSpamService } from 'src/app/modules/user/matching_spam.service';
import { UserDetailsServiceService } from 'src/app/modules/user/user_details.service';
import { UserRegisterCacheService } from 'src/app/modules/user/user_register_cache.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtAcessService } from '../common/services/jwt_access.service';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserForgotPasswordCacheService } from './user/user_forgot_password.service';
import { EntitiesModule } from './entities.module';

@Module({
  imports: [
    EntitiesModule,
    UsersModule,
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }), // 10 request every minute
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAcessService,
    UserDetailsServiceService,
    UserRegisterCacheService,
    MatchingSpamService,
    UserBelongingsService,
    UserForgotPasswordCacheService,
  ],
  exports: [AuthService, JwtAcessService],
})
export class AuthModule {}
