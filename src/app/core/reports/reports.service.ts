import { AccountAbuseReportDto } from './dto/account_abues.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountAbuseReport } from 'src/database/entity/account_abuse_reports.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(AccountAbuseReport) private readonly reportRepo: Repository<AccountAbuseReport>) {}

  public async save(data: AccountAbuseReportDto, imageId: number) {
    const { server, summonerName } = data;
    const report = this.reportRepo.create({ server, summoner_name: summonerName, imageId });

    return await this.reportRepo.save(report);
  }
}
