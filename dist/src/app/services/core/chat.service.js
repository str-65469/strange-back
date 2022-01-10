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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const exception_message_code_enum_1 = require("../../common/enum/message_codes/exception_message_code.enum");
const general_exception_1 = require("../../common/exceptions/general.exception");
const typeorm_1 = require("typeorm");
const chat_head_service_1 = require("./chat/chat_head.service");
const chat_messages_service_1 = require("./chat/chat_messages.service");
const chat_participants_service_1 = require("./chat/chat_participants.service");
let ChatService = class ChatService {
    constructor(chatParticipantsService, chatMessagesService, chatHeadService, connection) {
        this.chatParticipantsService = chatParticipantsService;
        this.chatMessagesService = chatMessagesService;
        this.chatHeadService = chatHeadService;
        this.connection = connection;
    }
    async userBelongsToChatHead(userId, partnerId, chatHeadId) {
        const participants = await this.chatParticipantsService.getChatParticipantsByUser(userId, partnerId, chatHeadId);
        const user = participants.find((participant) => participant.chatHeadId === chatHeadId && participant.userId === userId);
        const partner = participants.find((participant) => participant.chatHeadId === chatHeadId && participant.userId === partnerId);
        if (!user) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.USER_DOESNT_BELONG_TO_CHATHEAD);
        }
        if (!partner) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.USER_CHATHEAD_PARTNER_NOT_FOUND);
        }
        return {
            user,
            partner,
        };
    }
    async insertMessage(userId, chatHeadId, message) {
        return this.chatMessagesService.insertMessage(userId, chatHeadId, message);
    }
    async createChatTables(userId, partnerId) {
        return this.connection.transaction(async (manager) => {
            const participants = await this.chatParticipantsService.getChatParticipants(userId, partnerId);
            if (participants.length > 0) {
                return;
            }
            const chatHeadTableModel = this.chatHeadService.createTableModel();
            const chatHeadTable = await manager.save(chatHeadTableModel);
            const chatParticipantsTableModel = this.chatParticipantsService.createTableModel(userId, partnerId, chatHeadTable.id);
            await manager.save(chatParticipantsTableModel);
        });
    }
    async getChatheads(userId) {
        const userChatParticipants = await this.chatParticipantsService.getUserChatParticipants(userId);
        const chatHeadIds = userChatParticipants.map((el) => el.chatHeadId);
        const chatHeads = await this.chatHeadService.getChatHeads(chatHeadIds);
        return chatHeads.map((el) => {
            el.chatParticipant = el.chatParticipants.find((participant) => participant.userId !== userId);
            return el;
        });
    }
    getMessages(userId, chatHeadId, take, lastId) {
        const takeCount = take || 10;
        return this.chatMessagesService.fetchMessages(userId, chatHeadId, takeCount, lastId);
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_participants_service_1.ChatParticipantsService,
        chat_messages_service_1.ChatMessagesService,
        chat_head_service_1.ChatHeadService,
        typeorm_1.Connection])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map