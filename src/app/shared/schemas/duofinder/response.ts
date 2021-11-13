import { DuoFinderResponseType, DuoFinderTransferTypes } from './duofinder';
import { UserDetails } from 'src/database/entity/user_details.entity';
import User from 'src/database/entity/user.entity';

export interface HandleDuoFindBody {
  prevFound: {
    id: number;
  };
  type: DuoFinderTransferTypes;
}

export interface DuoFinderResponseInit {
  type: DuoFinderResponseType;
  found_duo: User;
  found_duo_details: UserDetails;
  notifications: any[];
}
