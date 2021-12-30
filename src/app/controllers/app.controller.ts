import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ContactUsService } from '../services/core/contact_us.service';
import { ContactUsDto } from '../common/request/contact_us.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly contactUsService: ContactUsService, private readonly jwtService: JwtService) {}

  @Get('test')
  public test(@Req() req: Request) {
    return {
      x1: req.headers['x-forwarded-for'],
      x2: req.socket.remoteAddress,
      x3: req.ip,
      x4: req.ips,
      x5: req.header('x-forwarded-for'),
      x6: req.socket.remoteAddress,
    };
  }

  @Post('/contact_us')
  async contactUs(@Body() body: ContactUsDto) {
    return await this.contactUsService.contactUs(body);
  }
}
