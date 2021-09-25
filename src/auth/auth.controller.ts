import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { Controller, Post, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post('/login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    const { user, access_token } = await this.authService.validateUser(body);

    res.cookie('accessToken', access_token, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }
}
