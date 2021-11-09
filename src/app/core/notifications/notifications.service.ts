import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(MatchedDuosNotifications)
    private readonly notificationRepo: Repository<MatchedDuosNotifications>,
  ) {}

  async save(user: User, matchedUser: User) {
    const matched = this.notificationRepo.create({
      user,
      matchedUser,
    });

    return await this.notificationRepo.save(matched);
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.notificationRepo.createQueryBuilder().delete().where('id = :id', { id }).execute();

    return res.affected > 0;
  }

  async updateMatchedNotification(id: number): Promise<boolean> {
    const res = await this.notificationRepo
      .createQueryBuilder()
      .update()
      .set({ is_seen: true })
      .where('id = :id', { id })
      .execute();

    return res.affected > 0;
  }

  async all(user: User) {
    return await this.notificationRepo.find({
      where: { user },
    });
  }
}
