import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { UserCommand } from './user/user.command';
import { UserService } from './user/user.service';
import { configService } from '../config.service';

@Module({
  imports: [
    CommandModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
  ],
  controllers: [],
  providers: [UserCommand, UserService],
})
export class CommandsModule {}
