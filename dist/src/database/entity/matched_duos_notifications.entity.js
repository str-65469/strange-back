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
exports.MatchedDuosNotifications = void 0;
const typeorm_1 = require("typeorm");
const general_1 = require("../entity_inheritance/general");
const user_entity_1 = require("./user.entity");
let MatchedDuosNotifications = class MatchedDuosNotifications extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ default: false, type: 'boolean' }),
    __metadata("design:type", Boolean)
], MatchedDuosNotifications.prototype, "is_seen", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, type: 'boolean' }),
    __metadata("design:type", Boolean)
], MatchedDuosNotifications.prototype, "is_hidden_seen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], MatchedDuosNotifications.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.notificationUsers),
    __metadata("design:type", user_entity_1.default)
], MatchedDuosNotifications.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.notificationMatchedUsers),
    __metadata("design:type", user_entity_1.default)
], MatchedDuosNotifications.prototype, "matchedUser", void 0);
MatchedDuosNotifications = __decorate([
    (0, typeorm_1.Entity)('matched_duos_notifications')
], MatchedDuosNotifications);
exports.MatchedDuosNotifications = MatchedDuosNotifications;
//# sourceMappingURL=matched_duos_notifications.entity.js.map