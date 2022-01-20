import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
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
