import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AccountAbuseReportDto } from '../schemas/request/account_abues.dto';
import { ReportsService } from '../modules/non_auth/reports.service';
import { UsersService } from '../modules/user/users.service';
import { FileHelper } from '../utils/file.helper';
import { GeneralHelper } from '../utils/general.helper';
import { ExceptionMessageCode } from '../common/enum/message_codes/exception_message_code.enum';
import { GenericException } from '../common/exceptions/general.exception';
import { SummonerDetailsFailure } from '../common/failures/lol_api/summoner_details.failure.enum';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportSerice: ReportsService, private readonly userService: UsersService) {}

    @UseGuards(ThrottlerGuard)
    @Post('accounts/abuse')
    async check(@Body() data: AccountAbuseReportDto) {
        const { server, summonerName, email } = data;

        // second check if user lol credentials is valid
        const summonerOnlyDetailsResponse = await this.userService.summonerNameDetails(server, summonerName);
        const imagePath = await summonerOnlyDetailsResponse.fold(
            (l) => {
                switch (l) {
                    case SummonerDetailsFailure.UNKNOWN:
                        throw new GenericException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            ExceptionMessageCode.INTERNAL_SERVER_ERROR,
                            'unknow error occured in api',
                        );
                    case SummonerDetailsFailure.SUMMONER_NAME_NOT_FOUND:
                        throw new GenericException(
                            HttpStatus.BAD_REQUEST,
                            ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND,
                        );
                }
            },
            async (r) => {
                const picturesArr = GeneralHelper.range(0, 10);
                const userPictureId = r.profileIconId;
                const validPictures = picturesArr.filter((el) => el !== userPictureId);
                const randomPictureId = GeneralHelper.random(validPictures);
                const imagePath = FileHelper.profileImage(randomPictureId);

                await this.reportSerice.save(data, randomPictureId, email);

                return imagePath;
            },
        );

        return { imagePath };
    }
}
