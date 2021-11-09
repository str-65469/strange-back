import { MatchingSpamService } from '../../../app/core/matching_spam/matchingspamservice.service';
import { NotificationsService } from '../../../app/core/notifications/notifications.service';
import { MatchedDuosService } from '../../../app/core/matched_duos/matchedduos.service';
import { MatchingLobbyService } from '../../../app/core/matching_lobby/matchinglobby.service';
import { DuoFinderResponseType, DuoFinderTransferTypes } from '../schemas/responses';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/user/services/users.service';
import User from 'src/database/entity/user.entity';

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
  constructor(
    private readonly matchedDuosService: MatchedDuosService,
    private readonly lobbyService: MatchingLobbyService,
    private readonly notificationService: NotificationsService,
    private readonly spamService: MatchingSpamService,
    private readonly userService: UsersService,
  ) {}

  public async initFirstMatch(user: User) {
    // find if I accepted someone and somebody else accepted me while I was away (DUO)
    const users = await this.lobbyService.checkIfBothInLobby(user);

    if (users && users.length) {
      for (const matchedUser of users) {
        // save both into matched table
        await this.matchedDuosService.save(user, matchedUser);
        await this.matchedDuosService.save(matchedUser, user);

        // save to my notification
        await this.notificationService.save(user, matchedUser);

        // remove both from lobby
        await this.lobbyService.remove(user, matchedUser);
        await this.lobbyService.remove(matchedUser, user);

        // update both matched list spam
        await this.spamService.update({ user, addedId: matchedUser.id, list: 'matched_list' });
        await this.spamService.update({ user: matchedUser, addedId: user.id, list: 'matched_list' });
      }
    }

    const matchedUsers = await this.matchedDuosService.getMatcheds(user);
    const notifications = await this.notificationService.all(user);
    const findDuoDetails = await this.userService.findNewDuoDetails(user);

    return {
      type: DuoFinderResponseType.DUO_FOUND,
      found_duo: findDuoDetails.user,
      found_duo_details: findDuoDetails ?? {},

      matched_users: matchedUsers ?? [],
      notifications: notifications ?? [],
    };
  }

  public async findDuo(user: User, prevFoundId: number) {
    // find new user (order must be like this)
    const findDuoDetails = await this.userService.findNewDuoDetails(user, prevFoundId);

    if (!findDuoDetails) {
      return null;
    }

    return {
      type: DuoFinderResponseType.DUO_FOUND,
      found_duo_details: findDuoDetails ?? {},
      found_duo: findDuoDetails.user ?? {},
    };
  }

  public async acceptDeclineLogic(user: User, prevFound: User, type: DuoFinderTransferTypes) {
    if (type === DuoFinderTransferTypes.ACCEPT) {
      // find if dude is in lobby and waiting for my accept (if somebody liked me already) (singular)
      const waitingUser = await this.lobbyService.userWaiting(prevFound, user);

      if (waitingUser) {
        // add both to matched
        // save both into matched table
        await this.matchedDuosService.save(user, prevFound);
        await this.matchedDuosService.save(prevFound, user);

        // remove from lobby
        await this.lobbyService.remove(prevFound, user);

        // update both matched list spam
        await this.spamService.update({ user: user, addedId: prevFound.id, list: 'matched_list' });
        await this.spamService.update({ user: prevFound, addedId: user.id, list: 'matched_list' });

        // save notification for other guy (for me it will be rendered on screen)
        const notification = await this.notificationService.save(prevFound, user);

        return {
          userToMyself: {
            type: DuoFinderResponseType.MATCH_FOUND,
            found_duo: prevFound ?? {},
            found_duo_details: prevFound.details ?? {},
          },
          myselfToUser: {
            type: DuoFinderResponseType.MATCH_FOUND_OTHER,
            found_duo: user ?? {},
            found_duo_details: user.details ?? {},
            notification: {
              ...user.details,
              is_seen: notification.is_seen,
              notification_id: notification.id,
              username: user.username,
            },
          },
        };
      } else {
        await this.spamService.update({ user: user, addedId: prevFound.id, list: 'accept_list' });
        await this.lobbyService.add(user, prevFound);
        return null;
      }
    } else {
      await this.spamService.update({ user: user, addedId: prevFound.id, list: 'decline_list' });
      return null;
    }
  }
}
