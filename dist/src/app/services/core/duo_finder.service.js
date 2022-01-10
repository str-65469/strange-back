"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuoFinderService = void 0;
const user_entity_1 = require("../../../database/entity/user.entity");
const common_1 = require("@nestjs/common");
const matching_lobby_service_1 = require("./matcheds/matching_lobby.service");
const matching_spam_service_1 = require("./matcheds/matching_spam.service");
const duofinder_1 = require("../../common/enum/duofinder/duofinder");
const users_service_1 = require("./user/users.service");
const notifications_service_1 = require("./notifications.service");
const matched_duos_service_1 = require("./matcheds/matched_duos.service");
let DuoFinderService = class DuoFinderService {
    constructor(matchedDuosService, lobbyService, notificationService, spamService, userService) {
        this.matchedDuosService = matchedDuosService;
        this.lobbyService = lobbyService;
        this.notificationService = notificationService;
        this.spamService = spamService;
        this.userService = userService;
    }
    async initFirstMatch(user) {
        const users = await this.lobbyService.checkIfBothInLobby(user);
        if (users && users.length) {
            for (const matchedUser of users) {
                await this.matchedDuosService.save(user, matchedUser);
                await this.matchedDuosService.save(matchedUser, user);
                await this.notificationService.save(user, matchedUser);
                await this.lobbyService.remove(user, matchedUser);
                await this.lobbyService.remove(matchedUser, user);
                await this.spamService.update({ user, addedId: matchedUser.id, list: 'matched_list' });
                await this.spamService.update({ user: matchedUser, addedId: user.id, list: 'matched_list' });
            }
        }
        const notifications = await this.notificationService.all(user);
        const findDuoDetails = await this.userService.findNewDuoDetails(user);
        if (!findDuoDetails) {
            return {
                type: duofinder_1.DuoFinderResponseType.NOBODY_FOUND,
                notifications: notifications !== null && notifications !== void 0 ? notifications : [],
            };
        }
        return {
            type: duofinder_1.DuoFinderResponseType.DUO_FOUND,
            found_duo: findDuoDetails.user,
            found_duo_details: findDuoDetails !== null && findDuoDetails !== void 0 ? findDuoDetails : {},
            notifications: notifications !== null && notifications !== void 0 ? notifications : [],
        };
    }
    async findDuo(user, prevFoundId) {
        const findDuoDetails = await this.userService.findNewDuoDetails(user, prevFoundId);
        if (!findDuoDetails) {
            return null;
        }
        return {
            type: duofinder_1.DuoFinderResponseType.DUO_FOUND,
            found_duo_details: findDuoDetails !== null && findDuoDetails !== void 0 ? findDuoDetails : {},
            found_duo: findDuoDetails.user,
        };
    }
    async acceptDeclineLogic(user, prevFound, type) {
        var _a, _b;
        if (type === duofinder_1.DuoFinderTransferTypes.ACCEPT) {
            const waitingUser = await this.lobbyService.userWaiting(prevFound, user);
            if (waitingUser) {
                await this.matchedDuosService.save(user, prevFound);
                await this.matchedDuosService.save(prevFound, user);
                await this.lobbyService.remove(prevFound, user);
                await this.spamService.update({ user: user, addedId: prevFound.id, list: 'matched_list' });
                await this.spamService.update({ user: prevFound, addedId: user.id, list: 'matched_list' });
                const saved = await this.notificationService.save(prevFound, user);
                const notification = await this.notificationService.findOne(saved.id);
                return {
                    type: duofinder_1.DuoFinderResponseType.MATCH_FOUND_OTHER,
                    found_duo_details: (_a = user.details) !== null && _a !== void 0 ? _a : {},
                    found_duo: user,
                    notification,
                };
            }
            else {
                await this.spamService.update({ user: user, addedId: prevFound.id, list: 'accept_list' });
                await this.lobbyService.add(user, prevFound);
                return null;
            }
        }
        if (type === duofinder_1.DuoFinderTransferTypes.DECLINE) {
            await this.spamService.update({ user: user, addedId: prevFound.id, list: 'decline_list' });
            return null;
        }
        if (type === duofinder_1.DuoFinderTransferTypes.SUPERLIKE) {
            await this.matchedDuosService.save(user, prevFound);
            await this.matchedDuosService.save(prevFound, user);
            await this.spamService.update({ user: user, addedId: prevFound.id, list: 'matched_list' });
            await this.spamService.update({ user: prevFound, addedId: user.id, list: 'matched_list' });
            const saved = await this.notificationService.save(prevFound, user);
            const notification = await this.notificationService.findOne(saved.id);
            const waitingUser = await this.lobbyService.userWaiting(prevFound, user);
            if (waitingUser) {
                await this.lobbyService.remove(prevFound, user);
            }
            return {
                type: duofinder_1.DuoFinderResponseType.MATCH_FOUND_OTHER_BY_SUPERLIKE,
                found_duo_details: (_b = user.details) !== null && _b !== void 0 ? _b : {},
                found_duo: user,
                notification,
            };
        }
    }
};
DuoFinderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [matched_duos_service_1.MatchedDuosService,
        matching_lobby_service_1.MatchingLobbyService,
        notifications_service_1.NotificationsService,
        matching_spam_service_1.MatchingSpamService,
        users_service_1.UsersService])
], DuoFinderService);
exports.DuoFinderService = DuoFinderService;
//# sourceMappingURL=duo_finder.service.js.map