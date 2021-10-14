import { JwtAcessService } from './../http/jwt/jwt-access.service';
import { Module } from '@nestjs/common';
import { DuoMatchGateway } from './duofinder/duofinder.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [],
  providers: [DuoMatchGateway, JwtAcessService],
})
export class SocketModule {}
