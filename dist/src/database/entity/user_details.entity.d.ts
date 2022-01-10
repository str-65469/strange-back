import { GeneralEntity } from '../entity_inheritance/general';
import { LolLeague } from '../../app/common/enum/lol_league.enum';
import { LolChampions } from '../../app/common/enum/lol_champions.enum';
import { LolMainLane } from '../../app/common/enum/lol_main_lane.enum';
import { LolServer } from '../../app/common/enum/lol_server.enum';
import User from './user.entity';
export declare class UserDetails extends GeneralEntity {
    summoner_name?: string;
    discord_name?: string;
    level?: number;
    league_points?: number;
    league_number?: number;
    win_rate?: number;
    server?: LolServer;
    main_lane?: LolMainLane;
    league?: LolLeague;
    main_champions?: LolChampions[];
    last_update_details?: Date;
    user: User;
}
