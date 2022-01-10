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
exports.ChatMessages = void 0;
const user_entity_1 = require("../user.entity");
const message_type_enum_1 = require("../../../app/common/enum/message_type.enum");
const general_1 = require("../../entity_inheritance/general");
const typeorm_1 = require("typeorm");
const chat_heads_entity_1 = require("./chat_heads.entity");
let ChatMessages = class ChatMessages extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ name: 'text_message', nullable: true, type: 'text' }),
    __metadata("design:type", String)
], ChatMessages.prototype, "textMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'img_url', nullable: true }),
    __metadata("design:type", String)
], ChatMessages.prototype, "imgUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'voice_url', nullable: true }),
    __metadata("design:type", String)
], ChatMessages.prototype, "voiceUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'video_url', nullable: true }),
    __metadata("design:type", String)
], ChatMessages.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gif_url', nullable: true }),
    __metadata("design:type", String)
], ChatMessages.prototype, "gifURl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        enum: message_type_enum_1.MessageType,
        type: 'enum',
        nullable: false,
    }),
    __metadata("design:type", String)
], ChatMessages.prototype, "messageType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], ChatMessages.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'unsigned big int', nullable: true }),
    __metadata("design:type", Number)
], ChatMessages.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'unsigned big int', nullable: true }),
    __metadata("design:type", Number)
], ChatMessages.prototype, "chatHeadId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.chatMessages),
    __metadata("design:type", user_entity_1.default)
], ChatMessages.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_heads_entity_1.ChatHeads, (chatHead) => chatHead.chatMessages),
    __metadata("design:type", chat_heads_entity_1.ChatHeads)
], ChatMessages.prototype, "chatHead", void 0);
ChatMessages = __decorate([
    (0, typeorm_1.Entity)('chat_messages')
], ChatMessages);
exports.ChatMessages = ChatMessages;
//# sourceMappingURL=chat_messages.entity.js.map