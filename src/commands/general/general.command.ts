import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Connection, EntityTarget, QueryRunner, Repository } from 'typeorm';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { ChatParticipants } from 'src/database/entity/chat/chat_participants.entity';
import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';
import { ChatHeads } from 'src/database/entity/chat/chat_heads.entity';
import * as readline from 'readline';

@Injectable({})
export class GeneralCommand {
  constructor(private readonly connection: Connection) {}

  @Command({
    command: 'cleanall',
    describe: 'clean all matching spams matched duos notifications and lobby from database',
  })
  async cleanall() {
    if (process.env.NODE_ENV !== 'development') {
      console.log('not so fast');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const matchingSpams = await this.setEmptyBuilder(queryRunner, MatchingSpams, 'spams').execute();
      const matchedDuos = await this.deleteAllBuilder(queryRunner, MatchedDuos).execute();
      const notifications = await this.deleteAllBuilder(queryRunner, MatchedDuosNotifications).execute();
      const matchingLobby = await this.deleteAllBuilder(queryRunner, MatchingLobby).execute();
      const chatParticipants = await this.deleteAllBuilder(queryRunner, ChatParticipants).execute();
      const chatMessages = await this.deleteAllBuilder(queryRunner, ChatMessages).execute();
      const chatHeads = await this.deleteAllBuilder(queryRunner, ChatHeads).execute();

      this.perfectLog({
        matchingSpams,
        matchedDuos,
        notifications,
        matchingLobby,
        chatParticipants,
        chatMessages,
        chatHeads,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err);

      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  private deleteAllBuilder<Entity>(queryRunner: QueryRunner, entity: EntityTarget<Entity>) {
    return queryRunner.manager.getRepository(entity).createQueryBuilder().delete().where('id > 0');
  }

  private setEmptyBuilder<Entity>(
    queryRunner: QueryRunner,
    entity: EntityTarget<Entity>,
    type: 'spams' | 'default',
  ) {
    if (type === 'spams') {
      return queryRunner.manager
        .getRepository(entity)
        .createQueryBuilder()
        .update()
        .set({ accept_list: [], decline_list: [], remove_list: [], matched_list: [] } as any);
    }
  }

  private perfectLog(values: object) {
    console.log('='.repeat(30));
    console.log(Object.values(values));
    console.log('='.repeat(30));
    console.table(values);
  }

  //TODO add later
  private areYouSure() {
    // const rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout,
    // });
    // rl.question('Are you sure you want to do this (y/n) ? ', function (name: 'y' | 'n') {
    //   if (name === 'y') {
    //     rl.close();
    //   } else {
    //     process.exit();
    //   }
    // });
    // rl.addListener('close', async () => {
    // });
  }
}
