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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const get_messages_dto_1 = require("../common/request/chat/get_messages.dto");
const send_message_dto_1 = require("../common/request/chat/send_message.dto");
const jwt_access_guard_1 = require("../security/guards/jwt_access.guard");
const user_safe_interceptor_1 = require("../security/interceptors/user_safe.interceptor");
const chat_service_1 = require("../services/core/chat.service");
const socket_service_1 = require("../services/core/socket.service");
let ChatController = class ChatController {
    constructor(chatService, socketService) {
        this.chatService = chatService;
        this.socketService = socketService;
    }
    async sendMessage(chatHeadId, partnerId, data, req) {
        const payload = req.jwtPayload;
        const participants = await this.chatService.userBelongsToChatHead(payload.id, partnerId, chatHeadId);
        const chatMessage = await this.chatService.insertMessage(payload.id, chatHeadId, data.message);
        this.socketService.sendMessageToUser(participants.partner.user.socket_id, chatMessage);
        return chatMessage;
    }
    getChats(req) {
        const payload = req.jwtPayload;
        return this.chatService.getChatheads(payload.id);
    }
    getMessages(req, chatHeadId, getMessagesDto) {
        const payload = req.jwtPayload;
        const { lastId, take } = getMessagesDto;
        return this.chatService.getMessages(payload.id, chatHeadId, take, lastId);
    }
};
__decorate([
    (0, common_1.Post)('/send-message/:chatHeadId/:partnerId'),
    __param(0, (0, common_1.Param)('chatHeadId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('partnerId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, send_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseInterceptors)(user_safe_interceptor_1.UserSafeInterceptor),
    (0, common_1.Get)('/heads'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getChats", null);
__decorate([
    (0, common_1.UseInterceptors)(user_safe_interceptor_1.UserSafeInterceptor),
    (0, common_1.Get)('/messages/:chatHeadId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('chatHeadId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, get_messages_dto_1.GetMessagesDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getMessages", null);
ChatController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.Controller)('/chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        socket_service_1.SocketService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map