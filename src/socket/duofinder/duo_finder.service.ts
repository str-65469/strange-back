import { SocketUserService } from './../user/socket_user.service';
import { Injectable } from '@nestjs/common';
import { DuoFinderResponseType, DuoFinderTransferTypes, HandleDuoFindBody } from './responses';

// export interface UserCombined extends User, UserDetails, MatchingSpams {}
//! change later
export interface UserCombined {
  id: any;
  username: any;
  img_path: any;
  email: any;
  discord_name: any;
  league: any;
  league_points: any;
  level: any;
  main_champions: any;
  main_lane: any;
  server: any;
  summoner_name: any;
  accept_list: any;
  decline_list: any;
  remove_list: any;
  matched_list: any;
}

@Injectable()
export class DuoFinderService {
  constructor(private readonly socketUserService: SocketUserService) {}

  public async initFirstMatch(userDetaled: UserCombined) {
    // find if I accepted someone and somebody else accepted me while I was away (DUO)
    const users = await this.socketUserService.checkIfBothInLobby(userDetaled);

    if (users && users.length) {
      for (const user of users) {
        // save both into matched table
        await this.socketUserService.saveUsersIntoMatched(userDetaled.id, user.user_id);
        await this.socketUserService.saveUsersIntoMatched(user.user_id, userDetaled.id);

        // save to my notification
        await this.socketUserService.saveMatchedDuoNotification(userDetaled.id, user.user_id);

        // remove both from lobby
        await this.socketUserService.removeUserFromLobby(userDetaled.id, user.user_id);
        await this.socketUserService.removeUserFromLobby(user.user_id, userDetaled.id);

        // update both matched list spam
        await this.socketUserService.updateFilterListInSpam({
          user_id: userDetaled.id,
          id: user.user_id,
          list: 'matched_list',
        });
        await this.socketUserService.updateFilterListInSpam({
          user_id: user.user_id,
          id: userDetaled.id,
          list: 'matched_list',
        });
      }
    }

    const matchedUsers = await this.socketUserService.findMatchedUsers(userDetaled.id); // get matches (from matched user table)
    const notifications = await this.socketUserService.getNotifications(userDetaled.id); // get all notifications

    // find new user (order must be like this)
    const findDuoDetails = await this.socketUserService.findNewDuoDetails(userDetaled);
    const findDuo = findDuoDetails ? await this.socketUserService.findDuo(findDuoDetails?.id) : {};

    return {
      type: DuoFinderResponseType.DUO_FOUND,
      found_duo: findDuo,
      found_duo_details: findDuoDetails ?? {},

      // for init
      matched_users: matchedUsers ?? [],
      notifications: notifications ?? [],
    };
  }

  public async findDuo(userDetaled: UserCombined, data: HandleDuoFindBody) {
    // find new user (order must be like this)
    const findDuoDetails = await this.socketUserService.findNewDuoDetailsFiltered(userDetaled, data);

    if (!findDuoDetails) {
      return null;
    }

    const findDuo = await this.socketUserService.findDuo(findDuoDetails?.id);

    return {
      type: DuoFinderResponseType.DUO_FOUND,
      found_duo: findDuo ?? {},
      found_duo_details: findDuoDetails ?? {},
    };
  }

  public async acceptDeclineLogic(userDetaled: UserCombined, data: HandleDuoFindBody) {
    //! accept
    if (data.type === DuoFinderTransferTypes.ACCEPT) {
      // find if dude is in lobby and waiting for my accept (if somebody liked me already) (singular)
      const waitingUser = await this.socketUserService.findIfUserIsWaiting(data.prevFound.id, userDetaled.id);

      if (waitingUser) {
        // add both to matched
        await this.socketUserService.saveUsersIntoMatched(userDetaled.id, data.prevFound.id);
        await this.socketUserService.saveUsersIntoMatched(data.prevFound.id, userDetaled.id);

        // remove from lobby
        await this.socketUserService.removeUserFromLobby(data.prevFound.id, userDetaled.id);

        // update both matched_list
        await this.socketUserService.updateFilterListInSpam({
          user_id: userDetaled.id,
          id: data.prevFound.id,
          list: 'matched_list',
        });
        await this.socketUserService.updateFilterListInSpam({
          user_id: data.prevFound.id,
          id: userDetaled.id,
          list: 'matched_list',
        });

        // found match
        // find user (from detailed and later joined to user) (order must be like this)
        const findDuoDetails = await this.socketUserService.getUserDuoDetails(data.prevFound.id);
        const findDuo = await this.socketUserService.findDuo(findDuoDetails?.id);

        const secondFindDuoDetails = await this.socketUserService.getUserDuoDetails(userDetaled.id);
        const secondFindDuo = await this.socketUserService.findDuo(secondFindDuoDetails?.id);

        // save notification for other guy (for me it will be rendered on screen)
        const notification = await this.socketUserService.saveMatchedDuoNotification(
          findDuo.id,
          secondFindDuo.id,
        );

        return {
          userToMyself: {
            type: DuoFinderResponseType.MATCH_FOUND,
            found_duo: findDuo ?? {},
            found_duo_details: findDuoDetails ?? {},
          },
          myselfToUser: {
            type: DuoFinderResponseType.MATCH_FOUND_OTHER,
            found_duo: secondFindDuo ?? {},
            found_duo_details: secondFindDuoDetails ?? {},
            notification: {
              ...secondFindDuoDetails,
              is_seen: notification.is_seen,
              notification_id: notification.id,
              username: secondFindDuo.username,
            },
          },
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

        return null;
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
