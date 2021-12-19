import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LolServer } from 'src/app/common/enum/lol_server.enum';

export class AccountAbuseReportDto {
  @IsString()
  @IsNotEmpty()
  summonerName: string;

  @IsEnum(LolServer)
  @IsNotEmpty()
  server: LolServer;
}
