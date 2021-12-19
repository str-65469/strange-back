import { Body, Controller, Get, UseGuards, UseInterceptors, Post, Put, Req } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from 'src/app/modules/auth/guards/jwt-access.guard';
import { UserPasswordUpdateDto } from 'src/app/modules/user/dto/user-update-password.dto';
import { UserProfileUpdateDto } from 'src/app/modules/user/dto/user-update.dto';
import { UserSafeInterceptor } from 'src/app/modules/user/interceptor/user_safe.interceptor';
import { UsersService } from 'src/app/modules/user/services/users.service';
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
