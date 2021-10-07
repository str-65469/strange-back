import { UserLoginDto } from '../user/dto/user-login.dto';
import { UsersService } from '../user/users.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface ValidateResponse {
  access_token: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(userCredentials: UserLoginDto): Promise<User> {
    // find user
    const user = await this.userService.findOne(userCredentials.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(userCredentials.password, user.password);

    if (!isPasswordMatch) {
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

  //   async refreshToken(token: string | any): Promise<any> {
  //     // const decodedToken = await this.jwtService.decode(token);
  //     const decodedToken = (await this.jwtService.decode(token)) as any;
  //     const { email, id } = decodedToken;
  //     const payload = { email, id };

  //     const options: JwtSignOptions = {
  //       secret: process.env.JWT_SECRET,
  //       expiresIn: '2w',
  //     };
  //     const accessToken = await this.jwtService.sign(payload, options);
  //     return { accessToken };
  //   }
}
