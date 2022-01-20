import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { LolServer } from 'src/app/common/enum/lol_server.enum';

export class SummonerAuthRequestStep1 {
    @IsNotEmpty()
    @IsString()
    @IsEnum(LolServer)
    server: LolServer;

    @IsNotEmpty()
    @IsString()
    summonerName: string;
}
