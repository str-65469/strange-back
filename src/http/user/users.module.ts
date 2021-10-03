import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import User from 'src/database/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: process.env.JWT_REGISTER_CACHE_SECRET }),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
