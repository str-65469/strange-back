import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { ContactUsService } from './app/core/contact_us/contact_us.service';
import { ContactUsDto } from './app/core/contact_us/dto/ContactUsDto';
import User from './database/entity/user.entity';
import { UserDetails } from './database/entity/user_details.entity';
import { JwtAcessTokenAuthGuard } from './modules/auth/guards/jwt-access.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly contactUsService: ContactUsService,
    // for test
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetails) private readonly userDetalsRepo: Repository<UserDetails>,
  ) {}

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
    return { message: 'hello' };
  }

  @Get('/relations')
  async getRelations() {
    const users = await this.userRepo.find({
      relations: ['details'],
    });

    return users;
  }
}
