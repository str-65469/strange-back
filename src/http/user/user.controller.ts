import { UsersService } from './users.service';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';

@Controller('user')
export class UserController {
  constructor(
    //for now !!!
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly userService: UsersService,
  ) {}

  @Get('test')
  async test() {
    // const profiles = await connection
    // .getRepository(Profile)
    // .createQueryBuilder("profile")
    // .leftJoinAndSelect("profile.user", "user")
    // .getMany();

    return this.userRepo.find({
      relations: ['userDetails'],
    });
    return 'hello from user';
  }
}
