import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgotPasswordCache } from 'src/database/entity/forgot_password_cache.entity';

@Injectable()
export class UserForgotPasswordCacheService {
  constructor(
    @InjectRepository(ForgotPasswordCache)
    private readonly forgotPasswordCacheRepo: Repository<ForgotPasswordCache>,
  ) {}

  async delete(id: number) {
    return await this.forgotPasswordCacheRepo.delete(id);
  }

  async findByEmail(email: string) {
    return this.forgotPasswordCacheRepo.findOne({ where: { email } });
  }

  async findOne(id: number) {
    return this.forgotPasswordCacheRepo.findOne(id);
  }

  async save(id: number, email: string, summoner_name: string, uuid: string) {
    const forgotPasswordCache = this.forgotPasswordCacheRepo.create({
      user_id: id,
      email,
      summoner_name,
      uuid,
    });

    return this.forgotPasswordCacheRepo.save(forgotPasswordCache);
  }

  async update(id: number, token: string, secret: string) {
    return this.forgotPasswordCacheRepo.update(id, {
      secret_token: token,
      secret,
    });
  }
}
