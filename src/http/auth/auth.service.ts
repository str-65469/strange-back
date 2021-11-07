import { UserLoginDto } from '../user/dto/user-login.dto';
import { UsersService } from '../user/users.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from 'src/database/entity/user.entity';
import { compare } from 'bcrypt';

export interface ValidateResponse {
  access_token: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(userCredentials: UserLoginDto): Promise<User> {
    // find user
    const user = await this.userService.findOneByEmail(userCredentials.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await compare(userCredentials.password, user.password);

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
