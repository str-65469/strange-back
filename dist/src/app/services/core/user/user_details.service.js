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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetailsServiceService = void 0;
const common_1 = require("@nestjs/common");
const user_register_cache_entity_1 = require("../../../../database/entity/user_register_cache.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_details_entity_1 = require("../../../../database/entity/user_details.entity");
const user_entity_1 = require("../../../../database/entity/user.entity");
const lol_server_enum_1 = require("../../../common/enum/lol_server.enum");
let UserDetailsServiceService = class UserDetailsServiceService {
    constructor(userDetailsRepo) {
        this.userDetailsRepo = userDetailsRepo;
    }
    async findBySummonerAndServer(server, summonerName) {
        return this.userDetailsRepo.findOne({ where: { summoner_name: summonerName, server } });
    }
    async saveUserDetailsByCachedData(userCached, user) {
        const { server, summoner_name, league, league_number, league_points, level, win_rate } = userCached;
        const userDetailed = this.userDetailsRepo.create({
            user,
            server,
            summoner_name,
            league,
            league_number,
            league_points,
            level,
            win_rate,
        });
        return await this.userDetailsRepo.save(userDetailed);
    }
};
UserDetailsServiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_details_entity_1.UserDetails)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserDetailsServiceService);
exports.UserDetailsServiceService = UserDetailsServiceService;
//# sourceMappingURL=user_details.service.js.map