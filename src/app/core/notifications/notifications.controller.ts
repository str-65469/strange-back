import { NotificationsService } from './notifications.service';
import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from 'src/modules/auth/guards/jwt-access.guard';

@Controller('notifications')
@UseGuards(JwtAcessTokenAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post('matcheds/:matchId')
  async delete(@Param('matchId', ParseIntPipe) matchId: number) {
    return await this.notificationService.delete(matchId);
  }

  @Get('matcheds/update/seen/:matchId')
  async setMatchedNotificationTrue(@Param('matchId', ParseIntPipe) matchId: number): Promise<boolean> {
    return await this.notificationService.updateMatchedNotification(matchId);
  }
}
