import { NotificationsService } from './notifications.service';
import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/http/user/users.service';
import { JwtAcessTokenAuthGuard } from 'src/http/auth/guards/jwt-access.guard';

@Controller('notifications')
@UseGuards(JwtAcessTokenAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationsService,
    private readonly userService: UsersService,
  ) {}

  @Post('matcheds/:matchId')
  async delete(@Param('matchId', ParseIntPipe) matchId: number) {
    return await this.notificationService.delete(matchId);
  }

  @Get('matcheds/update/seen')
  async setMatchedNotificationTrue(): Promise<boolean> {
    const userId = this.userService.userID();
    return await this.notificationService.updateMatchedNotification(userId);
  }
}
