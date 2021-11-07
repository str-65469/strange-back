import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtAcessService } from '../../app/jwt/jwt-access.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import User from 'src/database/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import UserDetails from 'src/database/entity/user_details.entity';
import { MulterModule } from '@nestjs/platform-express';
import { UserFileController } from './controllers/user_files.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDetails, UserRegisterCache]),
    JwtModule.register({ secret: process.env.JWT_REGISTER_CACHE_SECRET }),
    MulterModule.register({ dest: './upload' }),
    HttpModule.register({ baseURL: process.env.CHECKED_SERVER_URL, timeout: 10000 }), // 10 sec
  ],
  controllers: [UserController, UserFileController],
  providers: [UsersService, JwtAcessService],
  exports: [UsersService],
})
export class UsersModule {}
