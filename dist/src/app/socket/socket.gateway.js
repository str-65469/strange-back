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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const duo_finder_service_1 = require("../services/core/duo_finder.service");
const socket_io_1 = require("socket.io");
const config_1 = require("../../configs/config");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const socket_access_guard_1 = require("../security/guards/socket_access.guard");
const user_belongings_service_1 = require("../services/core/user/user_belongings.service");
const duofinder_1 = require("../common/enum/duofinder/duofinder");
const users_service_1 = require("../services/core/user/users.service");
const all_socket_exception_filter_1 = require("../common/exception_filters/all_socket_exception.filter");
const chat_service_1 = require("../services/core/chat.service");
let SocketGateway = class SocketGateway {
    constructor(duoFinderService, userService, userBelongingsService, chatService) {
        this.duoFinderService = duoFinderService;
        this.userService = userService;
        this.userBelongingsService = userBelongingsService;
        this.chatService = chatService;
    }
    async handleDuoConnect(socket) {
        const { id, socket_id } = this.userService.userSocketPayload(socket);
        const user = await this.userService.userSpamAndDetails(id);
        console.log('joined' + socket_id);
        socket.join(socket_id);
        this.userService.updateOnlineStatus(user.id, true);
        return await this.duoFinderService.initFirstMatch(user);
    }
    async handleDuoFind(data, socket) {
        var _a, _b, _c, _d;
        const payload = this.userService.userSocketPayload(socket);
        const user = await this.userService.userSpamAndDetails(payload.id);
        const prevFound = await this.userService.getUserDetails(data.prevFound.id);
        if (data.type === duofinder_1.DuoFinderTransferTypes.SUPERLIKE) {
            const check = await this.userBelongingsService.find(user.id);
            if (check.super_like && check.super_like === 0) {
                throw new websockets_1.WsException('not enough superlike');
            }
        }
        if (data && data.prevFound && Object.values(data.prevFound).length == 0) {
            socket.emit('duo_match_finder', { type: duofinder_1.DuoFinderResponseType.NOBODY_FOUND });
            return;
        }
        if (data.prevFound.id === user.id) {
            return;
        }
        const foundAnyone = await this.duoFinderService.acceptDeclineLogic(user, prevFound, data.type);
        const userRenewed = await this.userService.userSpamAndDetails(user.id);
        const foundNewMatch = await this.duoFinderService.findDuo(userRenewed, data.prevFound.id);
        if (data.type === duofinder_1.DuoFinderTransferTypes.JUST_FIND_ANOTHER) {
            if (foundNewMatch) {
                socket.emit('duo_match_finder', JSON.parse((0, class_transformer_1.serialize)(foundNewMatch)));
            }
            else {
                socket.emit('duo_match_finder', { type: duofinder_1.DuoFinderResponseType.NOBODY_FOUND });
            }
            return;
        }
        if (!foundNewMatch) {
            if (foundAnyone) {
                if (foundAnyone.type === duofinder_1.DuoFinderResponseType.MATCH_FOUND_OTHER) {
                    socket.emit('duo_match_finder', JSON.parse((0, class_transformer_1.serialize)({
                        type: duofinder_1.DuoFinderResponseType.MATCH_FOUND,
                        found_duo: prevFound !== null && prevFound !== void 0 ? prevFound : {},
                        found_duo_details: (_a = prevFound.details) !== null && _a !== void 0 ? _a : {},
                    })));
                }
                if (foundAnyone.type === duofinder_1.DuoFinderResponseType.MATCH_FOUND_OTHER_BY_SUPERLIKE) {
                    await this.userBelongingsService.decreaseSuperLike(user.id, 1);
                    socket.emit('duo_match_finder', JSON.parse((0, class_transformer_1.serialize)({
                        type: duofinder_1.DuoFinderResponseType.MATCH_FOUND_BY_SUPERLIKE,
                        found_duo: prevFound !== null && prevFound !== void 0 ? prevFound : {},
                        found_duo_details: (_b = prevFound.details) !== null && _b !== void 0 ? _b : {},
                    })));
                }
                socket.emit('duo_match_finder', { type: duofinder_1.DuoFinderResponseType.NOBODY_FOUND });
                this.wss.sockets.to(prevFound.socket_id).emit('duo_match_finder', JSON.parse((0, class_transformer_1.serialize)(foundAnyone)));
                this.chatService.createChatTables(user.id, prevFound.id);
            }
            else {
                socket.emit('duo_match_finder', { type: duofinder_1.DuoFinderResponseType.NOBODY_FOUND });
            }
            return;
        }
        if (!foundAnyone) {
            socket.emit('duo_match_finder', JSON.parse((0, class_transformer_1.serialize)(foundNewMatch)));
            return;
        }
        if (foundAnyone.type === duofinder_1.DuoFinderResponseType.MATCH_FOUND_OTHER) {
            socket.emit('duo_match_finder', JSON.parse((0, class_transformer_1.serialize)({
                type: duofinder_1.DuoFinderResponseType.MATCH_FOUND,
                found_duo: prevFound !== null && prevFound !== void 0 ? prevFound : {},
                found_duo_details: (_c = prevFound.details) !== null && _c !== void 0 ? _c : {},
            })));
        }
        if (foundAnyone.type === duofinder_1.DuoFinderResponseType.MATCH_FOUND_OTHER_BY_SUPERLIKE) {
            await this.userBelongingsService.decreaseSuperLike(user.id, 1);
            socket.emit('duo_match_finder', JSON.parse((0, class_transformer_1.serialize)({
                type: duofinder_1.DuoFinderResponseType.MATCH_FOUND_BY_SUPERLIKE,
                found_duo: prevFound !== null && prevFound !== void 0 ? prevFound : {},
                found_duo_details: (_d = prevFound.details) !== null && _d !== void 0 ? _d : {},
            })));
        }
        socket.emit('duo_match_finder', JSON.parse((0, class_transformer_1.serialize)(foundNewMatch)));
        this.wss.sockets.to(prevFound.socket_id).emit('duo_match_finder', JSON.parse((0, class_transformer_1.serialize)(foundAnyone)));
        this.chatService.createChatTables(user.id, prevFound.id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "wss", void 0);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, websockets_1.SubscribeMessage)(config_1.configs.socket.duomatchConnect),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleDuoConnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(config_1.configs.socket.duomatchFind),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleDuoFind", null);
SocketGateway = __decorate([
    (0, common_1.UseGuards)(socket_access_guard_1.SocketAccessGuard),
    (0, common_1.UseFilters)(all_socket_exception_filter_1.AllSocketExceptionsFilter),
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [duo_finder_service_1.DuoFinderService,
        users_service_1.UsersService,
        user_belongings_service_1.UserBelongingsService,
        chat_service_1.ChatService])
], SocketGateway);
exports.SocketGateway = SocketGateway;
//# sourceMappingURL=socket.gateway.js.map