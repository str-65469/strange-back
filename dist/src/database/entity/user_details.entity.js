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
exports.UserDetails = void 0;
const typeorm_1 = require("typeorm");
const general_1 = require("../entity_inheritance/general");
const lol_league_enum_1 = require("../../app/common/enum/lol_league.enum");
const lol_champions_enum_1 = require("../../app/common/enum/lol_champions.enum");
const lol_main_lane_enum_1 = require("../../app/common/enum/lol_main_lane.enum");
const lol_server_enum_1 = require("../../app/common/enum/lol_server.enum");
const user_entity_1 = require("./user.entity");
let UserDetails = class UserDetails extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserDetails.prototype, "summoner_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserDetails.prototype, "discord_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UserDetails.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UserDetails.prototype, "league_points", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UserDetails.prototype, "league_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], UserDetails.prototype, "win_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'enum', enum: lol_server_enum_1.LolServer }),
    __metadata("design:type", String)
], UserDetails.prototype, "server", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'enum', enum: lol_main_lane_enum_1.LolMainLane }),
    __metadata("design:type", String)
], UserDetails.prototype, "main_lane", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'enum', enum: lol_league_enum_1.LolLeague }),
    __metadata("design:type", String)
], UserDetails.prototype, "league", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'enum', enum: lol_champions_enum_1.LolChampions, array: true }),
    __metadata("design:type", Array)
], UserDetails.prototype, "main_champions", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamptz' }),
    __metadata("design:type", Date)
], UserDetails.prototype, "last_update_details", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.default, (user) => user.details),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.default)
], UserDetails.prototype, "user", void 0);
UserDetails = __decorate([
    (0, typeorm_1.Entity)()
], UserDetails);
exports.UserDetails = UserDetails;
//# sourceMappingURL=user_details.entity.js.map