import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { User } from 'src/database/entity/user.entity';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { LolServer } from 'src/app/common/enum/lol_server.enum';
import { LolLeague } from 'src/app/common/enum/lol_league.enum';
import { LolMainLane } from 'src/app/common/enum/lol_main_lane.enum';
import { LolChampions } from 'src/app/common/enum/lol_champions.enum';
import { UserBelongings } from 'src/database/entity/user_belongings.entity';

@Injectable()
export class SeedUserCommand {
    constructor(private readonly connection: Connection) {}

    @Command({
        command: 'seed:user <amount>',
        describe: 'seed <amount> of users in database with all the neccessary tables',
    })
    async seedUserTables(
        @Positional({ name: 'amount', describe: 'the amount of users', type: 'number' }) amount: number,
    ) {
        if (process.env.NODE_ENV !== 'development') {
            console.log('not so fast');
            process.exit();
        }

        if (amount < 0) {
            console.log('amount inccorect');
            process.exit();
        }

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (let i = 0; i < amount; i++) {
                const user = await queryRunner.manager.getRepository(User).save({
                    username: faker.name.findName(),
                    email: faker.internet.email(),
                    password: bcrypt.hashSync('password', bcrypt.genSaltSync(12)),
                    socket_id: faker.random.alphaNumeric(20),
                    secret: faker.random.alphaNumeric(20),
                    ip: faker.random.alphaNumeric(20),
                    is_online: false,
                });

                console.log(`seeded user id: ${user.id}, username: ${user.username}`);

                await queryRunner.manager.getRepository(UserDetails).save({
                    summoner_name: faker.name.findName(),
                    discord_name: faker.name.findName(),
                    level: faker.datatype.number(200),
                    league: faker.random.arrayElement(Object.values(LolLeague)),
                    league_points: faker.datatype.number(100),
                    league_number: faker.datatype.number({ min: 1, max: 4 }),
                    win_rate: faker.datatype.number({ min: 30, max: 100 }),
                    server: faker.random.arrayElement(Object.values(LolServer)),
                    main_lane: faker.random.arrayElement(Object.values(LolMainLane)),
                    main_champions: faker.random.arrayElements(Object.values(LolChampions), 3),
                    user,
                });

                await queryRunner.manager.getRepository(UserBelongings).save({ user });
                await queryRunner.manager.getRepository(MatchingSpams).save({ user });
            }

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
