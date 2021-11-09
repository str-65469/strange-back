import { UsersService } from '../../../modules/user/services/users.service';
import { MatchedDuosService } from './matchedduos.service';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { Request } from 'express';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('matcheds')
export class MatchedDuosController {
  constructor(private readonly matchedDuosService: MatchedDuosService, private readonly userService: UsersService) {}

  @Get()
  async getMatchedDuos(@Query('lastId') lastId: number | null = null, @Req() req: Request) {
    const userId = this.userService.userID(req);

    if (lastId) {
      return await this.matchedDuosService.getPaginated(userId, lastId);
    }

    return await this.matchedDuosService.get(userId);
  }
}
