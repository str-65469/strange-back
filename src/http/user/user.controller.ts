import { UsersService } from './users.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';
import { JwtAcessTokenAuthGuard } from '../auth/guards/jwt-access.guard';

@Controller('user')
export class UserController {
  constructor(
    //for now !!!
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAcessTokenAuthGuard)
  @Get()
  async user() {
    return await this.userService.getUserDetails();
  }
}
