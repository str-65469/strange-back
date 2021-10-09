import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ContactUsService } from './app_services/contact_us/contact_us.service';
import { ContactUsDto } from './app_services/contact_us/dto/ContactUsDto';
import { JwtAcessTokenAuthGuard } from './http/auth/guards/jwt-access.guard';

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
  async test() {
    return { ms: 12 };
  }
}
