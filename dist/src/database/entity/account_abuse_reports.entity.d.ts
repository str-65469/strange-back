import { LolServer } from 'src/app/common/enum/lol_server.enum';
import { GeneralEntity } from '../entity_inheritance/general';
export declare class AccountAbuseReport extends GeneralEntity {
    summoner_name: string;
    server: LolServer;
    email: string;
    imagePath: string;
}
