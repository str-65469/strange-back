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
exports.ReferralLink = void 0;
const general_1 = require("../entity_inheritance/general");
const typeorm_1 = require("typeorm");
let ReferralLink = class ReferralLink extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ name: 'name', nullable: false }),
    __metadata("design:type", String)
], ReferralLink.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_link', nullable: false }),
    __metadata("design:type", String)
], ReferralLink.prototype, "urlLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'token', nullable: false }),
    __metadata("design:type", String)
], ReferralLink.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'secret', nullable: false }),
    __metadata("design:type", String)
], ReferralLink.prototype, "secret", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entered_count', nullable: false }),
    __metadata("design:type", Number)
], ReferralLink.prototype, "enteredCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registered_count', nullable: false }),
    __metadata("design:type", Number)
], ReferralLink.prototype, "registeredCount", void 0);
ReferralLink = __decorate([
    (0, typeorm_1.Entity)('referral_links')
], ReferralLink);
exports.ReferralLink = ReferralLink;
//# sourceMappingURL=referral_link.entity.js.map