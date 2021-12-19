import { Request } from 'express';
import { Body, Controller, Get, UseGuards, UseInterceptors, Post, Put, Req } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from 'src/app/modules/auth/guards/jwt-access.guard';
import { UserSafeInterceptor } from 'src/app/modules/user/interceptor/user_safe.interceptor';
import { UserPasswordUpdateDto } from '../services/core/user/dto/user-update-password.dto';
import { UserProfileUpdateDto } from '../services/core/user/dto/user-update.dto';
import { UsersService } from '../services/core/user/users.service';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(UserSafeInterceptor)
  @Get()
  async user(@Req() req: Request) {
    const id = this.userService.userID(req);

    return await this.userService.getUserDetails(id);
  }

  @UseInterceptors(UserSafeInterceptor)
  @Post('/profile/update')
  async userProfileUpdate(@Req() req: Request, @Body() data: UserProfileUpdateDto) {
    const id = this.userService.userID(req);

    return await this.userService.updateUserProfile(id, data);
  }

  @UseInterceptors(UserSafeInterceptor)
  @Put('/profile/update-password')
  async updatePassword(@Req() req: Request, @Body() data: UserPasswordUpdateDto) {
    const id = this.userService.userID(req);

    return this.userService.updateUserCredentials(id, data);
  }
}
