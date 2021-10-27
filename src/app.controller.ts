import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ContactUsService } from './app/contact_us/contact_us.service';
import { ContactUsDto } from './app/contact_us/dto/ContactUsDto';
import { JwtAcessTokenAuthGuard } from './http/auth/guards/jwt-access.guard';

import { performance } from 'perf_hooks';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly contactUsService: ContactUsService) {}

  @UseGuards(JwtAcessTokenAuthGuard)
  @Get('protected')
  getHello() {
    return this.appService.getHello();
  }

  @Post('/contact_us')
  async contactUs(@Body() body: ContactUsDto) {
    return await this.contactUsService.contactUs(body);
  }

  @Get('/test')
  async test(@Req() req) {
    var startTime = performance.now();

    // console.log(req);
    console.log('---------------');

    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

    console.log(ip);

    var endTime = performance.now();

    const finalTime = endTime - startTime;

    return { message: `Call to doSomething took: ${finalTime} ms`, user: req.user, d: 123 };
  }
}
