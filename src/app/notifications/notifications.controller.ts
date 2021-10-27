import { NotificationsService } from './notifications.service';
import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post('matcheds/:matchId')
  async delete(@Param('matchId', ParseIntPipe) matchId: number) {
    return await this.notificationService.delete(matchId);
  }
}
