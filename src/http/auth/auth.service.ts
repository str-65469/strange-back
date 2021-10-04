import { UserLoginDto } from '../user/dto/user-login.dto';
import { UsersService } from '../user/users.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import * as bcrypt from 'bcrypt';

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

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(userCredentials.password, user.password);

    if (isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
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
