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
exports.ChatMessagesService = void 0;
const common_1 = require("@nestjs/common");
const message_type_enum_1 = require("../../../common/enum/message_type.enum");
const pagination_1 = require("../../../common/schemas/pagination");
const chat_messages_repository_1 = require("../../../repositories/chat_messages.repository");
const chat_messages_entity_1 = require("../../../../database/entity/chat/chat_messages.entity");
const typeorm_1 = require("typeorm");
let ChatMessagesService = class ChatMessagesService {
    constructor(chatMessagesRepo) {
        this.chatMessagesRepo = chatMessagesRepo;
    }
    insertMessage(userId, chatHeadId, message) {
        const chatMessage = this.chatMessagesRepo.createModel({
            userId: userId,
            chatHeadId: chatHeadId,
            textMessage: message,
            messageType: message_type_enum_1.MessageType.TEXT,
        });
        return this.chatMessagesRepo.save(chatMessage);
    }
    async fetchMessages(userId, chatHeadId, take, lastId) {
        let chatWhere = {
            chatHeadId,
        };
        let countWhere = {
            chatHeadId,
        };
        if (lastId) {
            chatWhere = Object.assign(Object.assign({}, chatWhere), { id: (0, typeorm_1.LessThan)(lastId) });
        }
        const data = await this.chatMessagesRepo.find({
            where: chatWhere,
            take,
            order: { id: 'DESC' },
        });
        const count = await this.chatMessagesRepo.count({
            where: countWhere,
        });
        return {
            data,
            count,
        };
    }
};
ChatMessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_messages_repository_1.ChatMessagesRepository])
], ChatMessagesService);
exports.ChatMessagesService = ChatMessagesService;
//# sourceMappingURL=chat_messages.service.js.map