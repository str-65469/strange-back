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
exports.ChatParticipantsService = void 0;
const common_1 = require("@nestjs/common");
const chat_participant_repositry_1 = require("../../../repositories/chat_participant.repositry");
const chat_participants_entity_1 = require("../../../../database/entity/chat/chat_participants.entity");
let ChatParticipantsService = class ChatParticipantsService {
    constructor(chatParticipantsRepo) {
        this.chatParticipantsRepo = chatParticipantsRepo;
    }
    getChatParticipantsByUser(userId, partnerId, chatHeadId) {
        return this.chatParticipantsRepo.find({
            where: [
                {
                    userId: userId,
                    chatHeadId: chatHeadId,
                },
                {
                    userId: partnerId,
                    chatHeadId: chatHeadId,
                },
            ],
            relations: ['user'],
        });
    }
    getChatParticipants(userId, partnerId) {
        return this.chatParticipantsRepo.find({
            where: [
                {
                    user: userId,
                },
                {
                    user: partnerId,
                },
            ],
        });
    }
    createTableModel(userId, partnerId, chatHeadId) {
        return this.chatParticipantsRepo.createDoubleTableModel([
            {
                userId: userId,
                chatHeadId: chatHeadId,
            },
            {
                userId: partnerId,
                chatHeadId: chatHeadId,
            },
        ]);
    }
    getUserChatParticipants(userId) {
        return this.chatParticipantsRepo.find({
            where: {
                userId,
            },
        });
    }
};
ChatParticipantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_participant_repositry_1.ChatParticipantsRepository])
], ChatParticipantsService);
exports.ChatParticipantsService = ChatParticipantsService;
//# sourceMappingURL=chat_participants.service.js.map