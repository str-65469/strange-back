import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LolServer } from 'src/app/common/enum/lol_server.enum';

export class AccountAbuseReportDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    summonerName: string;

    @IsEnum(LolServer)
    @IsNotEmpty()
    server: LolServer;
}
