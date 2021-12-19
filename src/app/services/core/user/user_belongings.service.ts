import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBelongings } from 'src/database/entity/user_belongings.entity';
import User from 'src/database/entity/user.entity';

@Injectable()
export class UserBelongingsService {
  constructor(
    @InjectRepository(UserBelongings)
    private readonly userBelongingsRepo: Repository<UserBelongings>,
  ) {}

  find(userId: number) {
    return this.userBelongingsRepo.findOneOrFail({
      where: { userId },
    });
  }

  create(user: User) {
    const userBelonging = this.userBelongingsRepo.create({ user });

    return this.userBelongingsRepo.save(userBelonging);
  }

  async update(userId: number, amount: number) {
    const userBelonging = await this.userBelongingsRepo.findOneOrFail({
      where: {
        userId: userId,
      },
    });

    userBelonging.super_like = userBelonging.super_like + amount;

    return this.userBelongingsRepo.save(userBelonging);
  }

  async decreaseSuperLike(userId: number, amount: number) {
    const userBelonging = await this.userBelongingsRepo.findOneOrFail({
      where: {
        userId: userId,
      },
    });

    if (userBelonging.super_like && userBelonging.super_like > 0) {
      userBelonging.super_like = userBelonging.super_like - amount;
    }

    return this.userBelongingsRepo.save(userBelonging);
  }
}
