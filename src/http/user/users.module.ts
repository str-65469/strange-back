import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import User from 'src/database/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import UserDetails from 'src/database/entity/user_details.entity';
import { MulterModule } from '@nestjs/platform-express';
import { UserFileController } from './controllers/user_files.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDetails]),
    JwtModule.register({ secret: process.env.JWT_REGISTER_CACHE_SECRET }),
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [UserController, UserFileController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
