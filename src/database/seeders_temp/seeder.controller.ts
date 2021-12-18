import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { LolChampions } from '../../app/enum/lol_champions.enum';
import { LolServer } from '../../app/enum/lol_server.enum';
import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../entity/user.entity';
import * as faker from 'faker';
import { LolMainLane } from 'src/app/enum/lol_main_lane.enum';
import { LolLeague } from 'src/app/enum/lol_league.enum';
import { UserDetails } from '../entity/user_details.entity';
import { RandomGenerator } from 'src/app/helpers/random_generator';
import { SuperLikeServices } from '../entity/superlike_services.entity';
import { SuperLikeServiceType } from 'src/app/enum/superlike_services';

const { EU_NORDIC_EAST, EU_NORDIC_WEST } = LolServer;
const servers = [EU_NORDIC_WEST, EU_NORDIC_EAST];

@Controller('/seed')
export class SeederController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetails) private readonly userDetailsRepo: Repository<UserDetails>,
    @InjectRepository(MatchingSpams) private readonly spamRepo: Repository<MatchingSpams>,
    @InjectRepository(SuperLikeServices) private readonly superLikeServiceRepo: Repository<SuperLikeServices>,
  ) {}

  @Get('/user')
  async seedUsers(@Query('len') len: number) {
    if (process.env.NODE_ENV !== 'development') {
      throw new HttpException('not so fast', HttpStatus.FORBIDDEN);
    }

    const length = len ?? 400;

    for (let i = length; i--; ) {
      const user = this.userRepo.create({
        username: faker.name.findName(),
        email: faker.internet.email(),
        socket_id: RandomGenerator.randomString(),
        img_path: `https://picsum.photos/id/${RandomGenerator.randomIntInterval(1, 900)}/200/300`,
        secret: RandomGenerator.randomString(),
        password: 'password',
      });

      const savedUser = await this.userRepo.save(user);

      await this.userDetailsRepo.save({
        summoner_name: faker.name.findName(),
        discord_name: faker.name.findName(),
        win_rate: faker.datatype.float(),
        league_number: faker.random.arrayElement([1, 2, 3, 4]),
        server: faker.random.arrayElement(servers),
        main_lane: faker.random.arrayElement(Object.values(LolMainLane)),
        league: faker.random.arrayElement(Object.values(LolLeague)),
        main_champions: Array.from({ length: 6 }, () => faker.random.arrayElement(Object.values(LolChampions))),
        user: savedUser,
      });

      await this.spamRepo.save({ user: savedUser });
    }
  }

  @Get('/superlike')
  async seedSuperlikeServices() {
    const entities = await this.superLikeServiceRepo.find();

    if (entities.length) {
      await this.superLikeServiceRepo.delete(entities.map((el) => el.id));
    }

    await this.superLikeServiceRepo.save([
      {
        type: SuperLikeServiceType.STARTER,
        amount: 1,
        price: 0.9,
        full_price: 1,
      },
      {
        type: SuperLikeServiceType.MEDIUM,
        amount: 3,
        price: 2.15,
        percent: 20,
        full_price: 10000,
      },
      {
        type: SuperLikeServiceType.ULTIMATE,
        amount: 8,
        price: 9.1,
        percent: 10,
        full_price: 10000,
      },
    ]);

    return await this.superLikeServiceRepo.find();
  }
}
