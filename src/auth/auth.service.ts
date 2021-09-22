import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface LoginResponse {
  access_token: string;
  user: any;
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtServie: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (user && user.password === password) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async login(user: any): Promise<LoginResponse> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtServie.sign(payload),
      user,
    };
  }
}
