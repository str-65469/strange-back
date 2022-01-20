import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from 'src/app/guards/jwt_access.guard';
import { Request } from 'express';
import { MatchedDuosService } from '../modules/user/matched_duos.service';
import { UsersService } from '../modules/user/users.service';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('matcheds')
export class MatchedDuosController {
    constructor(
        private readonly matchedDuosService: MatchedDuosService,
        private readonly userService: UsersService,
    ) {}

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
