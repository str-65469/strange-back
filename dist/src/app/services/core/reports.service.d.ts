import { AccountAbuseReportDto } from '../../common/request/account_abues.dto';
import { AccountAbuseReport } from 'src/database/entity/account_abuse_reports.entity';
import { Repository } from 'typeorm';
export declare class ReportsService {
    private readonly reportRepo;
    constructor(reportRepo: Repository<AccountAbuseReport>);
    save(data: AccountAbuseReportDto, profileImageId: number, email: string): Promise<AccountAbuseReport>;
}
