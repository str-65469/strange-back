import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MatchingSpamService {
  constructor(
    @InjectRepository(MatchingSpams)
    private readonly spamRepo: Repository<MatchingSpams>,
  ) {}
  public async createEmptySpam(id: number) {
    const spam = new MatchingSpams();
    spam.user_id = id;

    return await this.spamRepo.save(spam);
  }
}
