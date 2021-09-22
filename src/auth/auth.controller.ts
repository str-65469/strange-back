import { UserLoginDto } from './../users/dto/user-login.dto';
import { Controller, Post, UseGuards, Res, Req, Body } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @UseGuards(LocalAuthGuard)
  @Post('/login')
  //   async login(user: userLoginDto, @Res() res: Response) {
  async login(@Body() body: UserLoginDto) {
    const user = await this.authService.validateUser(body);

    return {
      user,
    };

    // const { user, access_token } = await this.authService.login(req.user);

    // res.cookie('accessToken', access_token, {
    //   expires: new Date(new Date().getTime() + 30 * 1000),
    //   sameSite: 'strict',
    //   httpOnly: true,
    // });

    // return res.send(user);
  }
}
