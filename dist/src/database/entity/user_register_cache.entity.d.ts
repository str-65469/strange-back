import { LolLeague } from 'src/app/common/enum/lol_league.enum';
import { LolServer } from '../../app/common/enum/lol_server.enum';
import { GeneralEntity } from '../entity_inheritance/general';
export declare class UserRegisterCache extends GeneralEntity {
    username: string;
    email: string;
    password: string;
    server?: LolServer;
    secret_token?: string;
    expiry_date?: Date;
    level?: number;
    league_number?: number;
    league_points?: number;
    summoner_name?: string;
    win_rate?: number;
    league?: LolLeague;
}
