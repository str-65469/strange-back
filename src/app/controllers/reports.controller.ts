import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AccountAbuseReportDto } from '../common/request/account_abues.dto';
import { ReportsService } from '../services/core/reports.service';
import { UsersService } from '../services/core/user/users.service';
import { FileHelper } from '../utils/file_helper';
import { GeneralHelper } from '../utils/general.helper';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportSerice: ReportsService, private readonly userService: UsersService) {}

  @UseGuards(ThrottlerGuard)
  @Post('accounts/abuse')
  async check(@Body() data: AccountAbuseReportDto) {
    const { server, summonerName, email } = data;

    // second check if user lol credentials is valid
    const checkedLolCreds = await this.userService.checkLolCredentialsValid(server, summonerName);
    const picturesArr = GeneralHelper.range(0, 10);
    const userPictureId = checkedLolCreds.profileImageId;
    const validPictures = picturesArr.filter((el) => el !== userPictureId);
    const randomPictureId = GeneralHelper.random(validPictures);
    const url = FileHelper.profileImage(randomPictureId);

    await this.reportSerice.save(data, randomPictureId, email);
    return url;
  }
}
