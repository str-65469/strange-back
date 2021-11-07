import { UserPasswordUpdateDto } from '../dto/user-update-password.dto';
import { UserSafeInterceptor } from '../interceptor/user_safe.interceptor';
import { UsersService } from '../services/users.service';
import { Body, Controller, Get, UseGuards, UseInterceptors, Post, Put } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from '../../auth/guards/jwt-access.guard';
import { UserProfileUpdateDto } from '../dto/user-update.dto';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(UserSafeInterceptor)
  @Get()
  async user() {
    return await this.userService.getUserDetails();
  }

  @UseInterceptors(UserSafeInterceptor)
  @Post('/profile/update')
  async userProfileUpdate(@Body() data: UserProfileUpdateDto) {
    return await this.userService.updateUserProfile(data);
  }

  @UseInterceptors(UserSafeInterceptor)
  @Put('/profile/update-password')
  async updatePassword(@Body() data: UserPasswordUpdateDto) {
    return this.userService.updateUserCredentials(data);
  }
}
