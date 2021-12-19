import User from 'src/database/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { MatchingLobbyService } from 'src/app/services/core/matcheds/matchinglobby.service';
import { MatchedDuosService } from 'src/app/services/core/matcheds/matchedduos.service';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matchingspamservice.service';
import { NotificationsService } from 'src/app/services/core/notifications/notifications.service';
import { DuoFinderResponseType, DuoFinderTransferTypes } from 'src/app/enum/duofinder/duofinder';
import { UsersService } from '../user/users.service';

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

    // const matchedUsers = await this.matchedDuosService.get(user);
    const notifications = await this.notificationService.all(user);
    const findDuoDetails = await this.userService.findNewDuoDetails(user);

    if (!findDuoDetails) {
      return {
        type: DuoFinderResponseType.NOBODY_FOUND,
        notifications: notifications ?? [],
      };
    }

    return {
      type: DuoFinderResponseType.DUO_FOUND,
      found_duo: findDuoDetails.user,
      found_duo_details: findDuoDetails ?? {},
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
      found_duo: findDuoDetails.user,
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
        const saved = await this.notificationService.save(prevFound, user);
        const notification = await this.notificationService.findOne(saved.id);

        return {
          type: DuoFinderResponseType.MATCH_FOUND_OTHER,
          found_duo_details: user.details ?? {},
          found_duo: user,
          notification,
        };
      } else {
        await this.spamService.update({ user: user, addedId: prevFound.id, list: 'accept_list' });
        await this.lobbyService.add(user, prevFound);
        return null;
      }
    }

    if (type === DuoFinderTransferTypes.DECLINE) {
      await this.spamService.update({ user: user, addedId: prevFound.id, list: 'decline_list' });
      return null;
    }

    if (type === DuoFinderTransferTypes.SUPERLIKE) {
      // add both to matched (save both into matched table)
      await this.matchedDuosService.save(user, prevFound);
      await this.matchedDuosService.save(prevFound, user);

      // update both matched list spam
      await this.spamService.update({ user: user, addedId: prevFound.id, list: 'matched_list' });
      await this.spamService.update({ user: prevFound, addedId: user.id, list: 'matched_list' });

      // save notification for other guy (for me it will be rendered on screen)
      const saved = await this.notificationService.save(prevFound, user);
      const notification = await this.notificationService.findOne(saved.id); // by relation

      // find if dude is in lobby and waiting for my accept (if somebody liked me already) (singular)
      const waitingUser = await this.lobbyService.userWaiting(prevFound, user);

      if (waitingUser) {
        // remove from lobby
        await this.lobbyService.remove(prevFound, user);
      }

      return {
        type: DuoFinderResponseType.MATCH_FOUND_OTHER_BY_SUPERLIKE,
        found_duo_details: user.details ?? {},
        found_duo: user,
        notification,
      };
    }
  }
}
