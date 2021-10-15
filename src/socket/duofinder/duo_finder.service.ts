import { MatchingSpams } from './../../database/entity/matching_spams.entity';
import { SocketUserService } from './../user/socket_user.service';
import { Injectable } from '@nestjs/common';
import { AccessTokenPayload } from 'src/http/jwt/jwt-access.service';
import User from 'src/database/entity/user.entity';
import UserDetails from 'src/database/entity/user_details.entity';
import { DuoFinderResponseType } from './responses';

export interface UserCombined extends User, UserDetails, MatchingSpams {}

@Injectable()
export class DuoFinderService {
  constructor(private readonly socketUserService: SocketUserService) {}

  public async initFirstMatch(payload: AccessTokenPayload) {
    // first fetch user and user spams
    console.log('=====================================================');

    // get detailed user
    const userDetaled: UserCombined = await this.socketUserService.findWithFilters(payload.id);

    // check if someone is waiting for current user
    const checkIfMeLiked = await this.socketUserService.checkIfCurrentUserLiked(userDetaled.id);

    if (checkIfMeLiked.length) {
      const ids = checkIfMeLiked.map((el) => el.id);

      // save users into matched
      const savedUsers = await this.socketUserService.saveUserIntoMatched(checkIfMeLiked);

      // update filter of user
      const updatedUser = await this.socketUserService.updateUserSpamFilter(userDetaled.id, ids);
    }

    // get matches (from matched user table)
    const matchedUsers = await this.socketUserService.findMatchedUsers(userDetaled.id);

    // find user (from detailed and later joined to user)
    const findDuo = await this.socketUserService.findDuo(userDetaled);

    console.log('=====================================================');

    return {
      type: DuoFinderResponseType.MATCH_FOUND,
      user: userDetaled,
      matched_user: findDuo,
      matched_users: matchedUsers,
    };
  }

  public findDuo() {
    const response = {
      msg: 'testing',
    };

    return response;
  }

  public findMatch() {
    const response = {
      msg: 'testing 2',
    };

    return response;
  }
}
