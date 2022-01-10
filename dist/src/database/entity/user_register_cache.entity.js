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
exports.UserRegisterCache = void 0;
const lol_league_enum_1 = require("../../app/common/enum/lol_league.enum");
const typeorm_1 = require("typeorm");
const lol_server_enum_1 = require("../../app/common/enum/lol_server.enum");
const general_1 = require("../entity_inheritance/general");
let UserRegisterCache = class UserRegisterCache extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserRegisterCache.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserRegisterCache.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserRegisterCache.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: lol_server_enum_1.LolServer }),
    __metadata("design:type", String)
], UserRegisterCache.prototype, "server", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserRegisterCache.prototype, "secret_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], UserRegisterCache.prototype, "expiry_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UserRegisterCache.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UserRegisterCache.prototype, "league_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UserRegisterCache.prototype, "league_points", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserRegisterCache.prototype, "summoner_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float8' }),
    __metadata("design:type", Number)
], UserRegisterCache.prototype, "win_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'enum', enum: lol_league_enum_1.LolLeague }),
    __metadata("design:type", String)
], UserRegisterCache.prototype, "league", void 0);
UserRegisterCache = __decorate([
    (0, typeorm_1.Entity)('user_register_cache')
], UserRegisterCache);
exports.UserRegisterCache = UserRegisterCache;
//# sourceMappingURL=user_register_cache.entity.js.map