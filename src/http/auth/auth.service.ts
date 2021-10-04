import { UserLoginDto } from '../user/dto/user-login.dto';
import { UsersService } from '../user/users.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import User from 'src/database/entity/user.entity';

export interface ValidateResponse {
  access_token: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(userCredentials: UserLoginDto): Promise<User> {
    // find user
    const user = await this.userService.findOne(userCredentials.email);

    // check user and password
    if (!user || user.password !== userCredentials.password) {
      // throw unauthorized exception
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async userExists(email: string): Promise<void> {
    const user = await this.userService.findOne(email);

    if (user) {
      throw new BadRequestException('Email already in use');
    }
  }
}
