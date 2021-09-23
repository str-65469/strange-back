import { JwtAcessService } from './../jwt/jwt-access.service';
import { UserLoginDto, SafeUserLogin } from './../users/dto/user-login.dto';
import { User, UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface ValidateResponse {
  access_token: string;
  user: SafeUserLogin;
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtAcessService: JwtAcessService) {}

  async validateUser(userCredentials: UserLoginDto): Promise<ValidateResponse> {
    // find user
    const user = await this.userService.findOne(userCredentials.email);

    // check user and password
    if (user && user.password === userCredentials.password) {
      return this.sendBackValidatedUser(user);
    }

    // throw unauthorized exception
    throw new UnauthorizedException('User not found');
  }

  private sendBackValidatedUser(user: User) {
    // remove password
    const { password, ...rest } = user;

    // get token with safe user payload
    const token = this.jwtAcessService.generateToken(rest);

    return { access_token: token, user };
  }
}
