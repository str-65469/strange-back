import { Body, Controller, Post } from '@nestjs/common';
import { map } from 'rxjs';
import { AccountAbuseReportDto } from '../services/core/reports/dto/account_abues.dto';
import { ReportsService } from '../services/core/reports/reports.service';
import { UsersService } from '../services/core/user/users.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportSerice: ReportsService, private readonly userService: UsersService) {}

  @Post('accounts/abuse')
  async check(@Body() data: AccountAbuseReportDto) {
    const { server, summonerName } = data;

    // second check if user lol credentials is valid
    const checkedLolCreds = await this.userService.checkLolCredentialsValid(server, summonerName);

    return checkedLolCreds.pipe(
      map(async (res) => {
        const picturesArr = [123, 200, 400];
        const userPictureId = res.profileImageId;

        const validPictures = picturesArr.filter((el) => el !== userPictureId);

        const randomPicture = validPictures[Math.floor(Math.random() * validPictures.length)];

        const url = `${process.env.APP_URL}/public/static/abuse_images/${randomPicture}.jpg`;

        await this.reportSerice.save(data, randomPicture);

        return url;
      }),
    );
  }
}
