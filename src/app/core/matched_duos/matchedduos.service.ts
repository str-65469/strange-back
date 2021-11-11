import { UserSafeInterceptor } from './../../../modules/user/interceptor/user_safe.interceptor';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { ClassSerializerInterceptor, Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import User from 'src/database/entity/user.entity';
import { FileHelper } from 'src/app/helpers/file_helper';
import { UserResponse } from 'src/modules/user/schemas/user.response';

@Injectable()
export class MatchedDuosService {
  constructor(@InjectRepository(MatchedDuos) private readonly matchedRepo: Repository<MatchedDuos>) {}

  async save(user: User, matchedUser: User) {
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
        where: { user, matchedUser: MoreThan(lastId) },
        take: 5,
        relations: ['matchedUser', 'matchedUser.details'],
      });
    } else {
      data = await this.matchedRepo.find({
        where: { user },
        take: 5,
        relations: ['matchedUser', 'matchedUser.details'],
      });
    }

    return data.map((el) => {
      const user: UserResponse = el.matchedUser;
      user.full_image_path = FileHelper.imagePath(el.matchedUser.img_path);

      return user;
    });
  }
}
