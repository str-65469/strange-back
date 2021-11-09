import { UserPasswordUpdateDto } from '../dto/user-update-password.dto';
import { UserSafeInterceptor } from '../interceptor/user_safe.interceptor';
import { UsersService } from '../services/users.service';
import { Body, Controller, Get, UseGuards, UseInterceptors, Post, Put, Req } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from '../../auth/guards/jwt-access.guard';
import { UserProfileUpdateDto } from '../dto/user-update.dto';
import { Request } from 'express';

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
