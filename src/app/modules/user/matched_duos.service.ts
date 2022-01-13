import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import User from 'src/database/entity/user.entity';

@Injectable()
export class MatchedDuosService {
  constructor(@InjectRepository(MatchedDuos) private readonly matchedRepo: Repository<MatchedDuos>) {}

  async save(user: User, matchedUser: User) {
    const existed = await this.matchedRepo.findOne({
      where: {
        user,
        matchedUser,
      },
    });

    if (existed) {
      return;
    }

    const matched = this.matchedRepo.create({
      user,
      matchedUser,
    });

    return await this.matchedRepo.save(matched);
  }

  async get(user: User, lastId?: number) {
    let data: Array<MatchedDuos> = [];

    if (lastId) {
      data = await this.matchedRepo.find({
        where: { user, matchedUser: LessThan(lastId) },
        take: 5,
        order: { id: 'DESC' },
        relations: ['matchedUser', 'matchedUser.details'],
      });
    } else {
      data = await this.matchedRepo.find({
        where: { user },
        take: 5,
        order: { id: 'DESC' },
        relations: ['matchedUser', 'matchedUser.details'],
      });
    }

    return data.map((m) => m.matchedUser);
  }
}
