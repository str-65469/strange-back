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
exports.MatchingLobby = void 0;
const typeorm_1 = require("typeorm");
const general_1 = require("../entity_inheritance/general");
const user_entity_1 = require("./user.entity");
let MatchingLobby = class MatchingLobby extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.lobbyUsers),
    __metadata("design:type", user_entity_1.default)
], MatchingLobby.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.lobbyLikedUsers),
    __metadata("design:type", user_entity_1.default)
], MatchingLobby.prototype, "likedUser", void 0);
MatchingLobby = __decorate([
    (0, typeorm_1.Entity)('matching_lobby')
], MatchingLobby);
exports.MatchingLobby = MatchingLobby;
//# sourceMappingURL=matching_lobby.entity.js.map