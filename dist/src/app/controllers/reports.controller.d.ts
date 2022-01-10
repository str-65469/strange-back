import { AccountAbuseReportDto } from '../common/request/account_abues.dto';
import { ReportsService } from '../services/core/reports.service';
import { UsersService } from '../services/core/user/users.service';
export declare class ReportsController {
    private readonly reportSerice;
    private readonly userService;
    constructor(reportSerice: ReportsService, userService: UsersService);
    check(data: AccountAbuseReportDto): Promise<{
        imagePath: string;
    }>;
}
