import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ContactUsService } from './app_services/contact_us/contact_us.service';
import { ContactUsDto } from './app_services/contact_us/dto/ContactUsDto';
import { JwtAuthGuard } from './http/auth/guards/jwt-auth.guard';
import { JwtAcessTokenAuthGuard } from './http/auth/guards/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly contactUsService: ContactUsService) {}

  @UseGuards(JwtAcessTokenAuthGuard)
  //   @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Req() req) {
    // console.log(req);
    // console.log(req.cookies);

    // return req;
    return 123;
    return this.appService.getHello();
  }

  @Post('/contact_us')
  async contactUs(@Body() body: ContactUsDto) {
    return await this.contactUsService.contactUs(body);
  }
}
