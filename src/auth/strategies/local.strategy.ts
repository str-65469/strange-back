import { UserLoginDto } from './../../users/dto/user-login.dto';
import { AuthService } from '../auth.service';
import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public static readonly AUTH_GUARD_STRATEGY = 'local';

  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    }); // config
  }

  //   async validate(@Body() body: userLoginDto): Promise<any> {
  //     const { email, password } = body;

  //     const userX = await this.authService.validateUser(email, password);

  //     if (!userX) {
  //       throw new UnauthorizedException();
  //     }

  //     return userX;
  //   }
  async validate(email: string, password: string): Promise<any> {
    // const userX = await this.authService.validateUser(email, password);
    // if (!userX) {
    //   throw new UnauthorizedException();
    // }
    // return userX;
  }
}
