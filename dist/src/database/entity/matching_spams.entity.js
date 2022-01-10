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
exports.MatchingSpams = void 0;
const typeorm_1 = require("typeorm");
const general_1 = require("../entity_inheritance/general");
const user_entity_1 = require("./user.entity");
let MatchingSpams = class MatchingSpams extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'int', default: [], array: true }),
    __metadata("design:type", Array)
], MatchingSpams.prototype, "accept_list", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'int', default: [], array: true }),
    __metadata("design:type", Array)
], MatchingSpams.prototype, "decline_list", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'int', default: [], array: true }),
    __metadata("design:type", Array)
], MatchingSpams.prototype, "remove_list", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'int', default: [], array: true }),
    __metadata("design:type", Array)
], MatchingSpams.prototype, "matched_list", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.default, (user) => user.spams),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.default)
], MatchingSpams.prototype, "user", void 0);
MatchingSpams = __decorate([
    (0, typeorm_1.Entity)('matching_spams')
], MatchingSpams);
exports.MatchingSpams = MatchingSpams;
//# sourceMappingURL=matching_spams.entity.js.map