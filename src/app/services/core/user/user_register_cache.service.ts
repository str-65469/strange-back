import { UserRegisterCache } from '../../../../database/entity/user_register_cache.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRegisterCacheService {
  constructor(
    @InjectRepository(UserRegisterCache)
    private readonly userDetailsRepo: Repository<UserRegisterCache>,
  ) {}

  async delete(id) {
    return await this.userDetailsRepo.delete(id);
  }
}
