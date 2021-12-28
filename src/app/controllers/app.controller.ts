import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactUsService } from '../services/core/contact_us.service';
import { ContactUsDto } from '../common/request/contact_us.dto';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(private readonly contactUsService: ContactUsService, private readonly jwtService: JwtService) {}

  @Get('test')
  public test() {
    return 'free';
  }

  @Post('/contact_us')
  async contactUs(@Body() body: ContactUsDto) {
    return await this.contactUsService.contactUs(body);
  }
}
