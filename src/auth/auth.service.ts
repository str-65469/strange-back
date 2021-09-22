import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (user && user.password === password) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }
}
