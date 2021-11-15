import { AccountAbuseReportDto } from './dto/account_abues.dto';
import { ReportsService } from './reports.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ResponseBody } from 'src/app/shared/res/response_body';
import { ResponseStatusCode } from 'src/app/shared/schemas/status_code';
import { UsersService } from 'src/modules/user/services/users.service';
import { map } from 'rxjs';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly res: ResponseBody,
    private readonly reportSerice: ReportsService,
    private readonly userService: UsersService,
  ) {}

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

        const url = `${process.env.APP_URL}/static/abuse_images/${randomPicture}.jpg`;

        await this.reportSerice.save(data, randomPicture);

        return url;
      }),
    );
  }

  //   @Post('accounts/abuse')
  //   async reportAccountAbuse(@Body() data: AccountAbuseReportDto) {
  //     const resp = await this.reportSerice.save(data);

  //     if (resp) {
  //       return this.res.json({ message: 'successfully inserted report' });
  //     }

  //     return this.res.json({
  //       message: 'something went wrong',
  //       statusCode: ResponseStatusCode.SOMETHING_WENT_WRONG,
  //     });
  //   }
}
