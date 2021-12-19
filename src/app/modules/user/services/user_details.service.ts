import { Injectable } from '@nestjs/common';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from 'src/database/entity/user_details.entity';
import User from 'src/database/entity/user.entity';

@Injectable()
export class UserDetailsServiceService {
  constructor(
    @InjectRepository(UserDetails)
    private readonly userDetailsRepo: Repository<UserDetails>,
  ) {}

  async findBySummoner(summonerName: string) {
    return this.userDetailsRepo.findOne({ where: { summoner_name: summonerName } });
  }

  async saveUserDetailsByCachedData(userCached: UserRegisterCache, user: User): Promise<UserDetails> {
    const { server, summoner_name, league, league_number, league_points, level, win_rate } = userCached;

    const userDetailed = this.userDetailsRepo.create({
      user,
      server,
      summoner_name,
      league,
      league_number,
      league_points,
      level,
      win_rate,
    });

    return await this.userDetailsRepo.save(userDetailed);
  }
}
