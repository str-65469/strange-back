import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';
import { FileHelper } from 'src/app/helpers/file_helper';

@Injectable()
export class MatchedDuosService {
  constructor(
    @InjectRepository(MatchedDuos) private readonly matchedRepo: Repository<MatchedDuos>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  public async get(userId: number): Promise<any[]> {
    const matchedUsers = await this.matchedRepo
      .createQueryBuilder()
      .where('user_id = :id', { id: userId })
      .select('*')
      .orderBy('id', 'ASC')
      .limit(5)
      .getRawMany();

    if (matchedUsers.length) {
      // get user and user details based on ids
      const ids = matchedUsers.map((e) => e.matched_user_id);

      const matchedUsersDetails = await this.userRepo
        .createQueryBuilder('u')
        .leftJoinAndSelect('user_details', 'us', 'us.user_id = u.id') // use filters (spams)
        .where('u.id IN (:...ids)', { ids })
        .select(
          'u.id, u.username, u.img_path, u.email, us.discord_name, us.league, us.league_points, us.level, us.main_champions, us.main_lane, us.server, us.summoner_name, us.win_rate, us.league_number',
        )
        .getRawMany();

      return matchedUsersDetails.map((el) => {
        el.full_image_path = FileHelper.imagePath(el.img_path);
        return el;
      });
    }

    return [];
  }

  public async getPaginated(userId: number, lastId: number): Promise<any[]> {
    const matchedUsers = await this.matchedRepo
      .createQueryBuilder()
      .where('user_id = :id', { id: userId })
      .andWhere('matched_user_id > :lastId', { lastId: lastId })
      .select('*')
      .orderBy('id', 'ASC')
      .limit(5)
      .getRawMany();

    if (matchedUsers.length) {
      // get user and user details based on ids
      const ids = matchedUsers.map((e) => e.matched_user_id);

      const matchedUsersDetails = await this.userRepo
        .createQueryBuilder('u')
        .leftJoinAndSelect('user_details', 'us', 'us.user_id = u.id') // use filters (spams)
        .where('u.id IN (:...ids)', { ids })
        .select(
          'u.id, u.username, u.img_path, u.email, us.discord_name, us.league, us.league_points, us.level, us.main_champions, us.main_lane, us.server, us.summoner_name, us.win_rate, us.league_number',
        )
        .getRawMany();

      return matchedUsersDetails.map((el) => {
        el.full_image_path = FileHelper.imagePath(el.img_path);
        return el;
      });
    }

    return [];
  }

  async save(user: User, matchedUser: User) {
    const matched = this.matchedRepo.create({
      user,
      matchedUser,
    });

    return await this.matchedRepo.save(matched);
  }

  public async getMatcheds(user: User) {
    return await this.matchedRepo
      .find({
        where: { user },
        relations: ['matchedUser'],
      })
      .then((matcheds) => matcheds.map((m) => m.matchedUser));
  }
}
