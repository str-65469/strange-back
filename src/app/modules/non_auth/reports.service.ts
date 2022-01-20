import { AccountAbuseReportDto } from '../../schemas/request/account_abues.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountAbuseReport } from 'src/database/entity/account_abuse_reports.entity';
import { Repository } from 'typeorm';
import { FileHelper } from 'src/app/utils/file.helper';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(AccountAbuseReport) private readonly reportRepo: Repository<AccountAbuseReport>,
    ) {}

    public async save(data: AccountAbuseReportDto, profileImageId: number, email: string) {
        const { server, summonerName } = data;

        const report = this.reportRepo.create({
            server,
            summoner_name: summonerName,
            imagePath: FileHelper.profileImagePath(profileImageId),
            email,
        });

        return await this.reportRepo.save(report);
    }
}
