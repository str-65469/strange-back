import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Not, Raw } from 'typeorm';
import { AppService } from './app.service';
import { ContactUsService } from './app/core/contact_us/contact_us.service';
import { ContactUsDto } from './app/core/contact_us/dto/ContactUsDto';
import { LolLeague } from './app/enum/lol_league.enum';
import { LolServer } from './app/enum/lol_server.enum';
import { MatchingLobby } from './database/entity/matching_lobby.entity';
import User from './database/entity/user.entity';
import { UserDetails } from './database/entity/user_details.entity';
import { JwtAcessTokenAuthGuard } from './modules/auth/guards/jwt-access.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly contactUsService: ContactUsService,
    // for test
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetails) private readonly userDetalsRepo: Repository<UserDetails>,
    @InjectRepository(MatchingLobby) private readonly lobbyRepo: Repository<MatchingLobby>,
  ) {}

  @UseGuards(JwtAcessTokenAuthGuard)
  @Get('protected')
  getHello() {
    return this.appService.getHello();
  }

  @Post('/contact_us')
  async contactUs(@Body() body: ContactUsDto) {
    return await this.contactUsService.contactUs(body);
  }

  @Get('/test')
  async test() {
    return this.userDetalsRepo.findOne(1);
    return await this.userDetalsRepo.findOne({
      where: {
        user: Not(In([356, 357, 358, 359])),
        league: In([LolLeague.BRONZE, LolLeague.SILVER]),
        server: LolServer.EU_NORDIC_WEST,
      },

      order: { id: 'ASC' },
      relations: ['user'],
    });
    const prevId = 400;

    return await this.userDetalsRepo.findOne({
      where: {
        user: Raw((alias) => `${alias} > :prevId AND ${alias} NOT IN (:...Ids)`, { prevId, Ids: [356, 357, 358, 359] }),
        league: In([LolLeague.BRONZE, LolLeague.SILVER]),
        server: LolServer.EU_NORDIC_WEST,
      },
      order: { id: 'ASC' },
      relations: ['user'],
    });

    const user = await this.userRepo.findOne(1);
    const mines = await this.lobbyRepo.find({ where: { user: user }, relations: ['user', 'likedUser'] });
    const oponentIds = mines.map((e) => e.likedUser.id);

    if (mines && mines.length) {
      //   return oponents;
      return await this.lobbyRepo
        .find({
          where: {
            user: Not(In(oponentIds)),
            // likedUser: user,
          },

          relations: ['user'],
        })
        .then((lobbies) => lobbies.map((l) => l.user));
    }

    // return [];
    // const userAll = this.userRepo.findOne(1, {
    //   relations: ['spams', 'details'],
    // });
    // return userAll;
    // return { message: 'hello' };
  }

  @Get('/relations')
  async getRelations() {
    const users = await this.userRepo.find({
      relations: ['details'],
    });

    return users;
  }
}
