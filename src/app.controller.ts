import { LocalAuthGuard } from './auth/local-auth.guard';
import { Controller, Get, Post, UseGuards, Res, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req, @Res() res: Response) {
    const user = req.user;
    const accessToken = 'ashoisahsaohsaosaiuhdsa';

    res.cookie('accessToken', accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }

  @Get('protected')
  getHello(): string {
    return this.appService.getHello();
  }
}
