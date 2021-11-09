export enum DuoFinderResponseType {
  DUO_FOUND = 'DUO_FOUND',
  MATCH_FOUND = 'MATCH_FOUND',
  MATCH_FOUND_OTHER = 'MATCH_FOUND_OTHER',
  MATCH_NOT_FOUND = 'MATCH_NOT_FOUND',
  NOBODY_FOUND = 'NOBODY_FOUND',
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
}
