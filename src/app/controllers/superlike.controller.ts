import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAcessTokenAuthGuard } from 'src/app/modules/auth/guards/jwt-access.guard';
import { UsersService } from 'src/app/modules/user/services/users.service';
import { UserBelongingsService } from '../services/core/user/user_belongings.service';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('superlike')
export class SuperLikeController {
  constructor(private readonly userService: UsersService, private readonly userBelongingsService: UserBelongingsService) {}

  @Get('count')
  public async fetchSuperLike(@Req() req: Request) {
    const userId = this.userService.userID(req);

    const userBelongings = await this.userBelongingsService.find(userId);

    return {
      count: userBelongings.super_like,
    };
  }
}
