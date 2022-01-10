import { LolMainLane } from 'src/app/common/enum/lol_main_lane.enum';
import { LolChampions } from 'src/app/common/enum/lol_champions.enum';
export declare class UserProfileUpdateDto {
    username: string;
    main_lane: LolMainLane;
    main_champions: Array<LolChampions>;
    discord_name: string;
}
