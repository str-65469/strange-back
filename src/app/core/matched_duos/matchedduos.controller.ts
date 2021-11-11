import { UsersService } from '../../../modules/user/services/users.service';
import { MatchedDuosService } from './matchedduos.service';
import { ClassSerializerInterceptor, Controller, Get, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { Request } from 'express';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('matcheds')
export class MatchedDuosController {
  constructor(private readonly matchedDuosService: MatchedDuosService, private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getMatchedDuos(@Query('lastId') lastId: number | null = null, @Req() req: Request) {
    const userId = this.userService.userID(req);
    const user = await this.userService.user(userId);

    if (lastId) {
      return await this.matchedDuosService.get(user, lastId);
    }

    return await this.matchedDuosService.get(user);
  }
}
