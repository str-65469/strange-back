import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';

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
      // matching spams
      await queryRunner.manager
        .getRepository(MatchingSpams)
        .createQueryBuilder()
        .update()
        .set({ accept_list: [], decline_list: [], remove_list: [], matched_list: [] })
        .execute();

      // matcheds
      await queryRunner.manager
        .getRepository(MatchedDuos)
        .createQueryBuilder()
        .delete()
        .where('id > 0')
        .execute();

      // notifications
      await queryRunner.manager
        .getRepository(MatchedDuosNotifications)
        .createQueryBuilder()
        .delete()
        .where('id > 0')
        .execute();

      // lobby
      await queryRunner.manager
        .getRepository(MatchingLobby)
        .createQueryBuilder()
        .delete()
        .where('id > 0')
        .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err);

      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

    console.log('cleaned');
  }
}
