import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketUserService } from './user/socket_user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAcessService } from 'src/http/jwt/jwt-access.service';
import { DuoMatchGateway } from './duofinder/duofinder.gateway';
import { DuoFinderService } from './duofinder/duo_finder.service';
import User from 'src/database/entity/user.entity';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET }), TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [JwtAcessService, DuoMatchGateway, DuoFinderService, SocketUserService],
})
export class SocketModule {}
