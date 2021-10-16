// import { UserDetails } from '../../database/entity/user_details.entity';
import { Injectable } from '@nestjs/common';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UserDetails from 'src/database/entity/user_details.entity';
import User from 'src/database/entity/user.entity';

@Injectable()
export class UserDetailsServiceService {
  constructor(
    @InjectRepository(UserDetails)
    private readonly userDetailsRepo: Repository<UserDetails>,
  ) {}

  async saveUserDetailsByCachedData(userCached: UserRegisterCache, user: User) {
    const { server, summoner_name } = userCached;

    const userDetailed = new UserDetails();
    userDetailed.server = server;
    userDetailed.summoner_name = summoner_name;
    userDetailed.user_id = user;

    return await this.userDetailsRepo.save(userDetailed);
  }
}
