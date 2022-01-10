import { LolServer } from '../../enum/lol_server.enum';
export declare class UserRegisterDto {
    username: string;
    email: string;
    password: string;
    server: LolServer;
    summoner_name: string;
}
