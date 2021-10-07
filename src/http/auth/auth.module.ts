import { UserDetailsServiceService } from '../user_details/user_details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './../../mail/mail.module';
import { JwtAcessService } from './../jwt/jwt-access.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/users.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { UserRegisterCacheService } from '../user_register_cache/user_register_cache.service';
// import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MailModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    TypeOrmModule.forFeature([UserRegisterCache, UserDetails]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // JwtStrategy,
    JwtAcessService,
    UserDetailsServiceService,
    UserRegisterCacheService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
