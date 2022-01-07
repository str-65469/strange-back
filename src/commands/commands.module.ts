import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { TypeormConfig } from 'src/configs/typeorm';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { GeneralCommand } from './general/general.command';
import { UserCommand } from './user/user.command';

@Module({
  imports: [
    CommandModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(TypeormConfig.instance),
    TypeOrmModule.forFeature([MatchingSpams, MatchedDuos, MatchedDuosNotifications, MatchingLobby]),
  ],
  controllers: [],
  providers: [UserCommand, GeneralCommand],
})
export class CommandsModule {}
