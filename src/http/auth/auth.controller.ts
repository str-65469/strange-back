import { UserRegisterDto } from './../user/dto/user-register.dto';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { Controller, Post, Res, Body, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAcessService } from '../jwt/jwt-access.service';
import { UsersService } from '../user/users.service';
import { MailService } from 'src/mail/mail.service';

@Controller('/auth')
export class AuthController {
  constructor(
    //   private readonly user
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly jwtAcessService: JwtAcessService,
    private readonly mailServie: MailService,
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
    const { email, summoner_name, server } = body;

    // first check if user exists
    await this.authService.userExists(email);

    // second check if user lol credentials is valid
    const check = await this.userService.checkLolCredentialsValid(server, summoner_name);

    console.log(body);
    console.log(check);
    return 123;

    if (check) {
      // third cache into database
      const userCached = await this.userService.cacheUserRegister(body);

      console.log(userCached);

      // send to mail
      this.mailServie.sendUserConfirmation(userCached);
    }
  }
}

//! https://notiz.dev/blog/send-emails-with-nestjs
