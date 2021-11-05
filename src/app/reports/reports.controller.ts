import { AccountAbuseReportDto } from './dto/account_abues.dto';
import { ReportsService } from './reports.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ResponseBody } from 'src/shared/res/response_body';
import { ResponseStatusCode } from 'src/shared/schemas/status_code';

@Controller('reports')
export class ReportsController {
  constructor(private readonly res: ResponseBody, private readonly reportSerice: ReportsService) {}

  @Post('accounts/abuse')
  async reportAccountAbuse(@Body() data: AccountAbuseReportDto) {
    const resp = await this.reportSerice.create(data);

    if (resp) {
      return this.res.json({ message: 'successfully inserted report' });
    }

    return this.res.json({
      message: 'something went wrong',
      statusCode: ResponseStatusCode.SOMETHING_WENT_WRONG,
    });
  }
}
