import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './../user/dto/user-register.dto';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { Controller, Post, Res, Body, Get, Query, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAcessService } from '../jwt/jwt-access.service';
import { UsersService } from '../user/users.service';
import { MailService } from 'src/mail/mail.service';
// import * as jwt from 'jsonwebtoken'

@Controller('/auth')
export class AuthController {
  constructor(
    //   private readonly user
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly jwtAcessService: JwtAcessService,
    private readonly mailServie: MailService,
    private readonly jwtservice: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(body);
    const token = this.jwtAcessService.generateAccessToken(user);

    res.cookie('accessToken', token, {
      expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
      sameSite: 'none',
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

    if (check) {
      // third cache into database
      const userCached = await this.userService.cacheUserRegister(body);

      console.log('==================');
      console.log(userCached);

      // send to mail
      this.mailServie.sendUserConfirmation(userCached);
    }
  }

  @Get('/register/confirm')
  async registerVerify(
    @Query('id', ParseIntPipe) registerCacheID: number,
    @Query('secret') secretToken: string,
  ) {
    const d = await this.jwtservice.verify(secretToken, { secret: process.env.JWT_REGISTER_CACHE_SECRET });
    return d;
    // validate token

    // get data from cache

    // generate access_token and refresh token and new secret

    // save cached data in user

    // additional data to user details

    // delete user cached data

    // return response

    return {
      msg: 'hello world',
      id: registerCacheID,
      token: secretToken,
    };
  }
}

// jwt.verify(token, 'shhhhh', function(err, decoded) {
// 	if (err) {
// 	  /*
// 		err = {
// 		  name: 'TokenExpiredError',
// 		  message: 'jwt expired',
// 		  expiredAt: 1408621000
// 		}
// 	  */
// 	}
//   });
