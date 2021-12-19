import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from 'src/app/modules/auth/guards/jwt-access.guard';
import { UsersService } from 'src/app/modules/user/services/users.service';
import { Request } from 'express';
import { NotificationsService } from '../services/core/notifications/notifications.service';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService, private readonly userService: UsersService) {}

  @Post('matcheds/:matchId')
  async delete(@Param('matchId', ParseIntPipe) matchId: number) {
    return await this.notificationService.delete(matchId);
  }

  @Get('matcheds/update/seen/:matchId')
  async updateSeen(@Param('matchId', ParseIntPipe) matchId: number): Promise<boolean> {
    return await this.notificationService.updateMatchedNotification(matchId);
  }

  @Get('matcheds/update/hidden_seen')
  async updateHiddenSeen(@Req() req: Request) {
    const userId = await this.userService.userID(req);

    const result = await this.notificationService.updateAllHiddenSeen(userId);

    return result.affected > 0;
  }
}
