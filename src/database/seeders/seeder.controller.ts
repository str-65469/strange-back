import { LolChampions } from './../../enum/lol_champions.enum';
import { LolServer } from './../../enum/lol_server.enum';
import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, DeepPartial, getConnection, getRepository, Repository } from 'typeorm';
import User from '../entity/user.entity';
import * as faker from 'faker';
import { LolMainLane } from 'src/enum/lol_main_lane.enum';
import { LolLeague } from 'src/enum/lol_league.enum';
import UserDetails from '../entity/user_details.entity';
import { RandomGenerator } from 'src/helpers/random_generator';

@Controller('/seed')
export class SeederController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepo: Repository<UserDetails>,

    private connection: Connection,
  ) {}

  @Get('/user')
  async seedUsers(@Query('len') len: number) {
    if (process.env.NODE_ENV !== 'development') {
      throw new HttpException('not so fast', HttpStatus.FORBIDDEN);
    }

    const length = len ?? 700;

    for (let i = length; i--; ) {
      const user = new User();
      user.username = faker.name.findName();
      user.email = faker.internet.email();
      user.socket_id = RandomGenerator.randomString();
      user.img_path = `https://picsum.photos/id/${RandomGenerator.randomIntInterval(1, 900)}/200/300`;
      user.secret = RandomGenerator.randomString();
      user.password = '$2b$16$BIX.OGBn4J6wUDNniAqrC./AZ9W/gHoYzSbEqtmtrR2XOrtUYvI5K';

      const savedUser = await this.userRepo.save(user);

      const userDetailed = new UserDetails();

      userDetailed.user_id = savedUser;
      userDetailed.summoner_name = faker.name.findName();
      userDetailed.discord_name = faker.name.findName();
      userDetailed.server = faker.random.arrayElement([
        LolServer.NORTH_AMERICA,
        LolServer.RUSSIA,
        LolServer.EU_NORDIC_WEST,
        LolServer.EU_NORDIC_EAST,
      ]);
      userDetailed.main_lane = faker.random.arrayElement(Object.values(LolMainLane));
      userDetailed.league = faker.random.arrayElement(Object.values(LolLeague));
      userDetailed.main_champions = Array.from({ length: 6 }, () =>
        faker.random.arrayElement(Object.values(LolChampions)),
      );

      await this.userDetailsRepo.save(userDetailed);
    }

    console.log('hello');
  }
}
