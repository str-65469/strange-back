import { MatchingSpams } from './../../database/entity/matching_spams.entity';
import { SocketUserService } from './../user/socket_user.service';
import { Injectable } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import UserDetails from 'src/database/entity/user_details.entity';
import { DuoFinderResponseType, DuoFinderTransferTypes, HandleDuoFindBody } from './responses';

export interface UserCombined extends User, UserDetails, MatchingSpams {}

@Injectable()
export class DuoFinderService {
  constructor(private readonly socketUserService: SocketUserService) {}

  public async initFirstMatch(userDetaled: UserCombined) {
    // get matches (from matched user table)
    const matchedUsers = await this.socketUserService.findMatchedUsers(userDetaled.id);

    // find new user (from detailed and later joined to user) (order must be like this)
    const findDuoDetails = await this.socketUserService.findNewDuoDetails(userDetaled);
    const findDuo = await this.socketUserService.findDuo(findDuoDetails?.id);

    return {
      type: DuoFinderResponseType.DUO_FOUND,
      found_duo: findDuo ?? {},
      found_duo_details: findDuoDetails ?? {},
      matched_users: matchedUsers ?? [],
    };
  }

  public async findDuo(userDetaled: UserCombined, data: HandleDuoFindBody) {
    // find new user (from detailed and later joined to user) (order must be like this)
    const findDuoDetails = await this.socketUserService.findNewDuoDetailsFiltered(userDetaled, data);
    const findDuo = await this.socketUserService.findDuo(findDuoDetails?.id);

    return {
      type: DuoFinderResponseType.DUO_FOUND,
      found_duo: findDuo ?? {},
      found_duo_details: findDuoDetails ?? {},
    };
  }

  public async acceptDeclineLogic(userDetaled: UserCombined, data: HandleDuoFindBody) {
    // dont do anything if accept/decline was clicked on already matched user
    if (data.isMatched) {
      return null;
    }

    //! accept
    if (data.type === DuoFinderTransferTypes.ACCEPT) {
      // find if accepted dude is in lobby for my accept (if somebody liked me already)
      const waitingUser = await this.socketUserService.findIfUserIsWaiting(data.prevFound.id);

      if (waitingUser) {
        // add to matched
        await this.socketUserService.saveUsersIntoMatched(userDetaled.id, data.prevFound.id);

        // remove from lobby
        await this.socketUserService.removeUserFromLobby(data.prevFound.id);

        // update matched_list
        await this.socketUserService.updateFilterListInSpam({
          user_id: userDetaled.id,
          id: data.prevFound.id,
          list: 'matched_list',
        });

        // found match
        // find user (from detailed and later joined to user) (order must be like this)
        const findDuoDetails = await this.socketUserService.getUserDuoDetails(data.prevFound.id);
        const findDuo = await this.socketUserService.findDuo(findDuoDetails?.id);

        return {
          type: DuoFinderResponseType.MATCH_FOUND,
          found_duo: findDuo ?? {},
          found_duo_details: findDuoDetails ?? {},
        };
      } else {
        // update accept_list
        await this.socketUserService.updateFilterListInSpam({
          user_id: userDetaled.id,
          id: data.prevFound.id,
          list: 'accept_list',
        });

        // add to lobby
        await this.socketUserService.addUsersToLobby(userDetaled.id, data.prevFound.id);
      }
    }
    //! decline
    else {
      // update decline list
      await this.socketUserService.updateFilterListInSpam({
        user_id: userDetaled.id,
        id: data.prevFound.id,
        list: 'decline_list',
      });

      return null;
    }
  }
}
