import * as chProccess from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import User from './database/entity/user.entity';
import { Body, Controller, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { ContactUsService } from './app/core/contact_us/contact_us.service';
import { ContactUsDto } from './app/core/contact_us/dto/ContactUsDto';
import { MatchingLobby } from './database/entity/matching_lobby.entity';
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
    @InjectRepository(MatchingLobby) private readonly lobbyRepo: Repository<MatchingLobby>,
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

  @Get('/replace')
  async replace() {
    const isExactMatch = (str, match) => {
      const escapeRegExpMatch = match.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      return new RegExp(`\\b${escapeRegExpMatch}\\b`).test(str);
    };

    const automatePath = path.join(__dirname, '../../.env');
    const file = fs.readFileSync(automatePath);
    const textArr = file.toString().split('\n');

    // search for keys and values
    // const key1 = 'MUST_BE_REPLACED';
    // const value1 = '123';

    const keyvals = [
      {
        key: 'MUST_BE_REPLACED1',
        value: 'RGAPI-0632c76c-256e-49be-a50a-f2bd54d6849a',
      },
      {
        key: 'MUST_BE_REPLACED2',
        value: 'RGAPI-0632c76c-256e-49be-a50a-f2bd54d6849a',
      },
      {
        key: 'MUST_BE_REPLACED3',
        value: 'RGAPI-0632c76c-256e-49be-a50a-f2bd54d6849a',
      },
    ];

    keyvals.forEach((obj) => {
      // replace with new value
      let key1Index = textArr.findIndex((el) => isExactMatch(el, obj.key));

      if (key1Index === -1) {
        throw new NotFoundException();
      }

      let key1Value = textArr[key1Index]; // key and value joined e.g. key=value
      let key1Arr = key1Value.split('=');
      key1Arr[1] = obj.value;
      key1Value = key1Arr.join('='); // new key and value joined e.g. key=new_value
      textArr[key1Index] = key1Value;
    });

    const finalFileString = textArr.join('\n');

    try {
      fs.writeFileSync(automatePath, finalFileString, 'utf8');

      return {
        msg: 'replaced',
      };
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  @Get('/test')
  async test() {
    const automatePath = path.join(__dirname, '../../', '/automates/test.sh');

    chProccess.exec(`sh ${automatePath}`, (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });

    return `sh ${automatePath}`;
  }

  //   @Get('/cleanall')
  //   async cleanSpams() {
  //     if (process.env.NODE_ENV === 'development') {
  //       getRepository(MatchingSpams)
  //         .createQueryBuilder()
  //         .update()
  //         .set({ accept_list: [], decline_list: [], remove_list: [], matched_list: [] })
  //         .execute();

  //       getRepository(MatchedDuos).createQueryBuilder().delete().where('id > 0').execute();
  //       getRepository(MatchedDuosNotifications).createQueryBuilder().delete().where('id > 0').execute();
  //       getRepository(MatchingLobby).createQueryBuilder().delete().where('id > 0').execute();
  //       return 'cleaned';
  //     }

  //     return 'not so fast';
  //   }
}
