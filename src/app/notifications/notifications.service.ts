import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(MatchedDuosNotifications)
    private readonly notificationRepo: Repository<MatchedDuosNotifications>,
  ) {}

  public async delete(id: number): Promise<boolean> {
    const res = await this.notificationRepo.createQueryBuilder().delete().where('id = :id', { id }).execute();

    return res.affected > 0;
  }

  public async updateMatchedNotification(id: number): Promise<boolean> {
    const res = await this.notificationRepo
      .createQueryBuilder()
      .update()
      .set({ is_seen: true })
      .where('id = :id', { id })
      .execute();

    return res.affected > 0;
  }
}
