import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable({})
export class RenameCommand {
    constructor(private readonly connection: Connection) {}

    @Command({
        command: 'rename',
        describe: 'rename database names',
    })
    async cleanall() {
        if (process.env.NODE_ENV !== 'development') {
            console.log('not so fast');
        }

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            //TODO to all other tables
            await queryRunner.manager.query('ALTER TABLE "article" RENAME "ttle" to "title"');

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
}
