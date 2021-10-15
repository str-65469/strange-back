import { UserSafeInterceptor } from './interceptor/user_safe.interceptor';
import { UsersService } from './users.service';
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAcessTokenAuthGuard } from '../auth/guards/jwt-access.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAcessTokenAuthGuard)
  @UseInterceptors(UserSafeInterceptor)
  @Get()
  async user() {
    return await this.userService.getUserDetails();
  }
}
