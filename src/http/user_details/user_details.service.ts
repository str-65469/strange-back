import { UserDetails } from '../../database/entity/user_details.entity';
import { Injectable } from '@nestjs/common';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserDetailsServiceService {
  constructor(
    @InjectRepository(UserDetails)
    private readonly userDetailsRepo: Repository<UserDetails>,
  ) {}

  async saveUserDetailsByCachedData(userCached: UserRegisterCache) {
    const { server, summoner_name } = userCached;

    const userDetails = new UserDetails();
    userDetails.server = server;
    userDetails.summoner_name = summoner_name;

    return await this.userDetailsRepo.save(userDetails);
  }
}
