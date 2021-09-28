import { JwtAcessService } from './../jwt/jwt-access.service';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { UsersService } from '../user/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from 'src/database/entity/user.entity';

export interface ValidateResponse {
  access_token: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtAcessService: JwtAcessService,
  ) {}

  async validateUser(userCredentials: UserLoginDto): Promise<ValidateResponse> {
    // find user
    const user = await this.userService.findOne(userCredentials.email);

    // check user and password
    if (!user || user.password !== userCredentials.password) {
      // throw unauthorized exception
      throw new UnauthorizedException('User not found');
    }

    // get token with safe user payload
    const token = this.jwtAcessService.generateAccessToken(user);

    return { access_token: token, user };
  }
}
