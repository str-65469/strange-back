import * as chProccess from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { MatchingLobby } from '../../database/entity/matching_lobby.entity';
import { ContactUsService } from '../services/core/contact_us.service';
import { ContactUsDto } from '../common/request/contact_us.dto';
import { MatchedDuos } from '../../database/entity/matched_duos.entity';
import { MatchedDuosNotifications } from '../../database/entity/matched_duos_notifications.entity';
import { MatchingSpams } from '../../database/entity/matching_spams.entity';

@Controller()
export class AppController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post('/contact_us')
  async contactUs(@Body() body: ContactUsDto) {
    return await this.contactUsService.contactUs(body);
  }

  @Get('/replace')
  async replace() {
    if (process.env.NODE_ENV !== 'development') {
      return 'not so fast';
    }

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

  @Get('/bash')
  async test() {
    if (process.env.NODE_ENV !== 'development') {
      return 'not so fast';
    }

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

  @Get('/cleanall')
  async cleanSpams() {
    if (process.env.NODE_ENV !== 'development') {
      return 'not so fast';
    }

    getRepository(MatchingSpams)
      .createQueryBuilder()
      .update()
      .set({ accept_list: [], decline_list: [], remove_list: [], matched_list: [] })
      .execute();

    getRepository(MatchedDuos).createQueryBuilder().delete().where('id > 0').execute();
    getRepository(MatchedDuosNotifications).createQueryBuilder().delete().where('id > 0').execute();
    getRepository(MatchingLobby).createQueryBuilder().delete().where('id > 0').execute();
    return 'cleaned';
  }
}