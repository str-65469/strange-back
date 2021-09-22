import { UserLoginDto } from './../users/dto/user-login.dto';
import { UsersService } from './../users/users.service';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface LoginResponse {
  access_token: string;
  user: any;
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtServie: JwtService) {}

  async validateUser(userCredentials: UserLoginDto): Promise<any> {
    const user = await this.userService.findOne(userCredentials.email);

    if (user && user.password === userCredentials.password) {
      const { password, ...rest } = user;
      return rest;
    }

    throw new UnauthorizedException('User not found');
  }

  async login(user: any): Promise<LoginResponse> {
    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtServie.sign(payload),
      user,
    };
  }
}
