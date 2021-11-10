import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { UsersService } from '../user/services/users.service';
import * as bcrypt from 'bcrypt';
import User from 'src/database/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(userCredentials: UserLoginDto): Promise<User> {
    // find user
    const user = await this.userService.findOneByEmail(userCredentials.email, true);

    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(userCredentials.password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async userExists(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Email already in use');
    }
  }
}
