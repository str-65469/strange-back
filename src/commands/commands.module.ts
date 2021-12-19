import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { ConfigService } from 'src/config.service';
import { UserCommand } from './user/user.command';
import { UserService } from './user/user.service';

@Module({
  imports: [CommandModule, ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot(ConfigService.instance)],
  controllers: [],
  providers: [UserCommand, UserService],
})
export class CommandsModule {}
