import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { LolServer } from 'src/app/common/enum/lol_server.enum';

export class SummonerAuthRequest {
    @IsNotEmpty()
    @IsString()
    @IsEnum(LolServer)
    server: LolServer;

    @IsNotEmpty()
    @IsString()
    summonerName: string;

    @IsNotEmpty()
    @IsUUID()
    uuid: string;
}
