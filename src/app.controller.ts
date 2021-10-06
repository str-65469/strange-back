import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ContactUsService } from './app_services/contact_us/contact_us.service';
import { ContactUsDto } from './app_services/contact_us/dto/ContactUsDto';
import { JwtAuthGuard } from './http/auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly contactUsService: ContactUsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello() {
    return 123;
    return this.appService.getHello();
  }

  @Post('/contact_us')
  async contactUs(@Body() body: ContactUsDto) {
    return await this.contactUsService.contactUs(body);
  }
}
