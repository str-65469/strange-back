import { Request } from 'express';
import { Body, Controller, Get, UseGuards, UseInterceptors, Post, Put, Req } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from 'src/app/security/auth/jwt_access.guard';
import { UsersService } from '../services/core/user/users.service';
import { UserSafeInterceptor } from '../security/interceptors/user_safe.interceptor';
import { UserPasswordUpdateDto } from '../common/request/user/user_update_password.dto';
import { UserProfileUpdateDto } from '../common/request/user/user_update.dto';

@UseGuards(JwtAcessTokenAuthGuard)
@UseInterceptors(UserSafeInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async user(@Req() req: Request) {
    const id = this.userService.userID(req);

    return await this.userService.getUserDetails(id);
  }

  @Post('/profile/update')
  async userProfileUpdate(@Req() req: Request, @Body() data: UserProfileUpdateDto) {
    const id = this.userService.userID(req);

    return await this.userService.updateUserProfile(id, data);
  }

  @Put('/profile/update-password')
  async updatePassword(@Req() req: Request, @Body() data: UserPasswordUpdateDto) {
    const id = this.userService.userID(req);

    return this.userService.updateUserCredentials(id, data);
  }
}
