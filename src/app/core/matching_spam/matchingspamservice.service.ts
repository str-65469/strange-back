import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/database/entity/user.entity';

@Injectable()
export class MatchingSpamService {
  constructor(
    @InjectRepository(MatchingSpams)
    private readonly spamRepo: Repository<MatchingSpams>,
  ) {}
  public async createEmptySpam(user: User) {
    const spam = this.spamRepo.create({ user });

    return await this.spamRepo.save(spam);
  }
}
