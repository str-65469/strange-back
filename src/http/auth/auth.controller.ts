import { UserRegisterDto } from './../user/dto/user-register.dto';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { Controller, Post, Res, Body, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAcessService } from '../jwt/jwt-access.service';
import { UsersService } from '../user/users.service';

@Controller('/auth')
export class AuthController {
  constructor(
    //   private readonly user
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly jwtAcessService: JwtAcessService,
  ) {}

  @Post('/login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(body);
    const token = this.jwtAcessService.generateAccessToken(user);

    res.cookie('accessToken', token, {
      expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
      sameSite: 'none',
      //   sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }

  @Post('/register')
  async register(@Body() body: UserRegisterDto) {
    const user = this.userService.findOne(body.email);

    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    // send to mail
    // cache into database
  }
}
