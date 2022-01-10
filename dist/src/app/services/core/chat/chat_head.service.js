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
exports.ChatHeadService = void 0;
const common_1 = require("@nestjs/common");
const chat_head_repository_1 = require("../../../repositories/chat_head.repository");
const typeorm_1 = require("typeorm");
let ChatHeadService = class ChatHeadService {
    constructor(chatHeadRepository) {
        this.chatHeadRepository = chatHeadRepository;
    }
    createTableModel() {
        return this.chatHeadRepository.createTableModel({});
    }
    getChatHeads(chatHeadIds) {
        return this.chatHeadRepository.find({
            where: {
                id: (0, typeorm_1.In)(chatHeadIds),
            },
            relations: ['chatParticipants', 'chatParticipants.user'],
        });
    }
};
ChatHeadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_head_repository_1.ChatHeadRepository])
], ChatHeadService);
exports.ChatHeadService = ChatHeadService;
//# sourceMappingURL=chat_head.service.js.map