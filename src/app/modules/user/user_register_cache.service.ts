import { UserRegisterCache } from '../../../database/entity/user_register_cache.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRegisterCacheService {
  constructor(
    @InjectRepository(UserRegisterCache)
    private readonly userRegisterCacheRepo: Repository<UserRegisterCache>,
  ) {}

  async delete(id) {
    return this.userRegisterCacheRepo.delete(id);
  }

  findByEmailOrUsername(email: string, username: string) {
    return this.userRegisterCacheRepo.findOne({ where: [{ email }, { username }] });
  }

  async findOne(id: number) {
    return this.userRegisterCacheRepo.findOne(id);
  }
}
