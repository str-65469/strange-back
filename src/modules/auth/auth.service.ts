import { UserDetailsServiceService } from './../user/services/user_details.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { UsersService } from '../user/services/users.service';
import * as bcrypt from 'bcrypt';
import User from 'src/database/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly userDetailsService: UserDetailsServiceService) {}

  async validateUser(userCredentials: UserLoginDto): Promise<User> {
    // find user
    const user = await this.userService.findOneByEmail(userCredentials.email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(userCredentials.password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async usernameEmailSummonerExists(email: string, username: string, summonerName: string): Promise<void> {
    const user = await this.userService.findByEmailOrUsername(email, username);
    const userDetails = await this.userDetailsService.findBySummoner(summonerName);

    if (user) {
      if (user.email === email) {
        throw new BadRequestException('Email already in use');
      }
      if (user.username === username) {
        throw new BadRequestException('Username already in use');
      }
    }

    if (userDetails) {
      throw new BadRequestException('Summoner name already in user');
    }
  }
}
