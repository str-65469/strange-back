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
const superlike_payment_entity_1 = require("./superlike_payment.entity");
const matching_spams_entity_1 = require("./matching_spams.entity");
const matching_lobby_entity_1 = require("./matching_lobby.entity");
const matched_duos_entity_1 = require("./matched_duos.entity");
const matched_duos_notifications_entity_1 = require("./matched_duos_notifications.entity");
const typeorm_1 = require("typeorm");
const general_1 = require("../entity_inheritance/general");
const user_belongings_entity_1 = require("./user_belongings.entity");
const user_details_entity_1 = require("./user_details.entity");
const class_transformer_1 = require("class-transformer");
const file_helper_1 = require("../../app/utils/file_helper");
const chat_messages_entity_1 = require("./chat/chat_messages.entity");
const chat_participants_entity_1 = require("./chat/chat_participants.entity");
let User = class User extends general_1.GeneralEntity {
    setFullImagePath() {
        this.full_image_path = file_helper_1.FileHelper.imagePath(this.img_path);
    }
};
User.TABLE_NAME = 'users';
User.IMAGE_COLUMN_NAME = 'img_path';
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "img_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], User.prototype, "socket_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], User.prototype, "secret", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], User.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, nullable: true }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Boolean)
], User.prototype, "is_online", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => matched_duos_notifications_entity_1.MatchedDuosNotifications, (notifications) => notifications.user),
    __metadata("design:type", Array)
], User.prototype, "notificationUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => matched_duos_notifications_entity_1.MatchedDuosNotifications, (notifications) => notifications.matchedUser),
    __metadata("design:type", Array)
], User.prototype, "notificationMatchedUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => matched_duos_entity_1.MatchedDuos, (matched) => matched.user),
    __metadata("design:type", Array)
], User.prototype, "matchedDuoUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => matched_duos_entity_1.MatchedDuos, (matched) => matched.matchedUser),
    __metadata("design:type", Array)
], User.prototype, "matchedDuoMatchedUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => matching_lobby_entity_1.MatchingLobby, (lobby) => lobby.user),
    __metadata("design:type", Array)
], User.prototype, "lobbyUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => matching_lobby_entity_1.MatchingLobby, (lobby) => lobby.likedUser),
    __metadata("design:type", Array)
], User.prototype, "lobbyLikedUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => superlike_payment_entity_1.SuperLikePayment, (likes) => likes.user),
    __metadata("design:type", Array)
], User.prototype, "superLikePayments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_messages_entity_1.ChatMessages, (chatMessages) => chatMessages.user),
    __metadata("design:type", Array)
], User.prototype, "chatMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_participants_entity_1.ChatParticipants, (chatParticipants) => chatParticipants.user),
    __metadata("design:type", Array)
], User.prototype, "chatParticipants", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_belongings_entity_1.UserBelongings, (belongings) => belongings.user),
    __metadata("design:type", user_belongings_entity_1.UserBelongings)
], User.prototype, "belongings", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => matching_spams_entity_1.MatchingSpams, (spams) => spams.user),
    __metadata("design:type", matching_spams_entity_1.MatchingSpams)
], User.prototype, "spams", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_details_entity_1.UserDetails, (details) => details.user),
    __metadata("design:type", user_details_entity_1.UserDetails)
], User.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "setFullImagePath", null);
User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
exports.default = User;
//# sourceMappingURL=user.entity.js.map