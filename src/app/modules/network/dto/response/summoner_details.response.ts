import { LolLeague } from 'src/app/common/enum/lol_league.enum';

export class SummonerDetailsResponse {
    name: string;
    profileIconId: number;
    league: LolLeague;
    leagueNumber: number;
    leaguePoints: number;
    summonerLevel: number;
    winRatio: number;
    win: number;
    lose: number;
}
