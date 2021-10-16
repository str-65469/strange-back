export enum DuoFinderResponseType {
  DUO_FOUND = 'DUO_FOUND',
  MATCH_FOUND = 'MATCH_FOUND',
  MATCH_NOT_FOUND = 'MATCH_NOT_FOUND',
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  img_path: string;
  details: {
    id: number;
    summoner_name?: string;
    discord_name?: string;
    level?: number;
    league_points?: number;
    server?: string;
    main_lane?: string;
    league?: string;
    main_champions?: Array<string>;
  };
}

export interface DuoFinderResponse {
  type: DuoFinderResponseType;
  user: UserResponse;
  matched_user?: UserResponse; // may not found matched
  matched_users?: Array<UserResponse>; // may not found matched
}

export enum DuoFinderTransferTypes {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

export interface HandleDuoFindBody {
  prevFound: {
    id: number;
  };
  type: DuoFinderTransferTypes;
  isMatched: boolean;
}
