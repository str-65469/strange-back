import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactUsService } from '../services/core/contact_us.service';
import { ContactUsDto } from '../common/request/contact_us.dto';

@Controller()
export class AppController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Get('test')
  public test() {
    return 'welcome curious user congrats to making here, now please dont poke around here its dangerous';
  }

  @Post('/contact_us')
  async contactUs(@Body() body: ContactUsDto) {
    return await this.contactUsService.contactUs(body);
  }
}
