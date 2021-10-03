import { MailModule } from './../../mail/mail.module';
import { JwtAcessService } from './../jwt/jwt-access.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/users.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({ secret: process.env.JWT_SECRET }), MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAcessService],
  exports: [AuthService],
})
export class AuthModule {}
