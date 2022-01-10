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
exports.MatchedDuosService = void 0;
const matched_duos_entity_1 = require("../../../../database/entity/matched_duos.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../../../database/entity/user.entity");
let MatchedDuosService = class MatchedDuosService {
    constructor(matchedRepo) {
        this.matchedRepo = matchedRepo;
    }
    async save(user, matchedUser) {
        const existed = await this.matchedRepo.findOne({
            where: {
                user,
                matchedUser,
            },
        });
        if (existed) {
            return;
        }
        const matched = this.matchedRepo.create({
            user,
            matchedUser,
        });
        return await this.matchedRepo.save(matched);
    }
    async get(user, lastId) {
        let data = [];
        if (lastId) {
            data = await this.matchedRepo.find({
                where: { user, matchedUser: (0, typeorm_2.LessThan)(lastId) },
                take: 5,
                order: { id: 'DESC' },
                relations: ['matchedUser', 'matchedUser.details'],
            });
        }
        else {
            data = await this.matchedRepo.find({
                where: { user },
                take: 5,
                order: { id: 'DESC' },
                relations: ['matchedUser', 'matchedUser.details'],
            });
        }
        return data.map((m) => m.matchedUser);
    }
};
MatchedDuosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(matched_duos_entity_1.MatchedDuos)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MatchedDuosService);
exports.MatchedDuosService = MatchedDuosService;
//# sourceMappingURL=matched_duos.service.js.map