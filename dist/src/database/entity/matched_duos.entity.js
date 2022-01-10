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
exports.MatchedDuos = void 0;
const typeorm_1 = require("typeorm");
const general_1 = require("../entity_inheritance/general");
const user_entity_1 = require("./user.entity");
let MatchedDuos = class MatchedDuos extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], MatchedDuos.prototype, "is_favorite", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.matchedDuoUsers),
    __metadata("design:type", user_entity_1.default)
], MatchedDuos.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.matchedDuoMatchedUsers),
    __metadata("design:type", user_entity_1.default)
], MatchedDuos.prototype, "matchedUser", void 0);
MatchedDuos = __decorate([
    (0, typeorm_1.Entity)('matched_duos')
], MatchedDuos);
exports.MatchedDuos = MatchedDuos;
//# sourceMappingURL=matched_duos.entity.js.map