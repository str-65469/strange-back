import { MatchedDuoNotifications } from '../matchedduo_notifications/macthed_notifications';
import { DuoFinderResponseType, DuoFinderTransferTypes } from './duofinder';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { UserTemp } from '../user_temp';

export interface HandleDuoFindBody {
  prevFound: {
    id: number;
  };
  type: DuoFinderTransferTypes;
}

export interface DuoFinderResponseInit {
  type: DuoFinderResponseType;
  found_duo: UserTemp;
  found_duo_details: UserDetails;
  notifications: any[];
  //   notifications: MatchedDuoNotifications[];
}
