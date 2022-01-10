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
exports.ChatParticipants = void 0;
const user_entity_1 = require("../user.entity");
const general_1 = require("../../entity_inheritance/general");
const typeorm_1 = require("typeorm");
const chat_heads_entity_1 = require("./chat_heads.entity");
let ChatParticipants = class ChatParticipants extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'chat_last_deleted_at', nullable: true }),
    __metadata("design:type", Date)
], ChatParticipants.prototype, "chatLastDeletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'unsigned big int', nullable: true }),
    __metadata("design:type", Number)
], ChatParticipants.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'unsigned big int', nullable: true }),
    __metadata("design:type", Number)
], ChatParticipants.prototype, "chatHeadId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.chatParticipants),
    __metadata("design:type", user_entity_1.default)
], ChatParticipants.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_heads_entity_1.ChatHeads, (chatHead) => chatHead.chatParticipants),
    __metadata("design:type", chat_heads_entity_1.ChatHeads)
], ChatParticipants.prototype, "chatHead", void 0);
ChatParticipants = __decorate([
    (0, typeorm_1.Entity)('chat_participants')
], ChatParticipants);
exports.ChatParticipants = ChatParticipants;
//# sourceMappingURL=chat_participants.entity.js.map