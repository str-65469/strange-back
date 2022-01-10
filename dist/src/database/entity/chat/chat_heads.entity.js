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
exports.ChatHeads = void 0;
const general_1 = require("../../entity_inheritance/general");
const typeorm_1 = require("typeorm");
const chat_messages_entity_1 = require("./chat_messages.entity");
const chat_participants_entity_1 = require("./chat_participants.entity");
let ChatHeads = class ChatHeads extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ name: 'name', nullable: true }),
    __metadata("design:type", String)
], ChatHeads.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_one_to_one', nullable: false, default: true }),
    __metadata("design:type", Boolean)
], ChatHeads.prototype, "isOneToOne", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_participants_entity_1.ChatParticipants, (chatParticipants) => chatParticipants.chatHead),
    __metadata("design:type", Array)
], ChatHeads.prototype, "chatParticipants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_messages_entity_1.ChatMessages, (chatMessages) => chatMessages.chatHead),
    __metadata("design:type", Array)
], ChatHeads.prototype, "chatMessages", void 0);
ChatHeads = __decorate([
    (0, typeorm_1.Entity)('chat_heads')
], ChatHeads);
exports.ChatHeads = ChatHeads;
//# sourceMappingURL=chat_heads.entity.js.map