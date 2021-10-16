import { UserSafeInterceptor } from './interceptor/user_safe.interceptor';
import { UsersService } from './users.service';
import { Body, Controller, Get, Put, UseGuards, UseInterceptors, Post } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from '../auth/guards/jwt-access.guard';
import { UserProfileUpdateDto } from './dto/user-update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAcessTokenAuthGuard)
  @UseInterceptors(UserSafeInterceptor)
  @Get()
  async user() {
    return await this.userService.getUserDetails();
  }

  @UseGuards(JwtAcessTokenAuthGuard)
  @Post('/profile/update')
  async userProfileUpdate(@Body() data: UserProfileUpdateDto) {
    const user = await this.userService.updateUserProfile(data);
    user.full_image_path = user.img_path ? process.env.APP_URL + '/upload' + user.img_path : null;

    return user;
  }
}
