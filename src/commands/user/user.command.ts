import { Command } from 'nestjs-command';
import { Injectable, Scope } from '@nestjs/common';
import { getManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';

@Injectable()
export class UserCommand {
    @Command({
        command: 'user:update_image',
        describe: 'update image varchar to text',
    })
    async create() {
        const entityManager = getManager();

        await entityManager.transaction(async (manager) => {
            const updateQueryType = `ALTER TABLE ${User.TABLE_NAME} ALTER COLUMN ${User.IMAGE_COLUMN_NAME} TYPE TEXT;`;
            await manager.query(updateQueryType);
        });
    }
}
