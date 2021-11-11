import { UserDetails } from 'src/database/entity/user_details.entity';
import User from 'src/database/entity/user.entity';

export interface MatchedDuoNotifications extends User {
  details: UserDetails;
}
