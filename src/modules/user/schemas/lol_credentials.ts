import { LolLeague } from 'src/app/enum/lol_league.enum';

export interface LolCredentials {
  level: number;
  summonerName: string;
  division: LolLeague;
  divisionNumber: number;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRatio: number;
}

export interface LolCredentialsResponse {
  level: number;
  league: LolLeague;
  league_number: number;
  league_points: number;
  win_rate: number;
}
