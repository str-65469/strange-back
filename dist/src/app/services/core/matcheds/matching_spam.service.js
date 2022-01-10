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
exports.MatchingSpamService = void 0;
const matching_spams_entity_1 = require("../../../../database/entity/matching_spams.entity");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../../../../database/entity/user.entity");
let MatchingSpamService = class MatchingSpamService {
    constructor(spamRepo) {
        this.spamRepo = spamRepo;
    }
    async createEmptySpam(user) {
        const spam = this.spamRepo.create({ user });
        return await this.spamRepo.save(spam);
    }
    async update({ user, addedId, list }, pop) {
        const spam = await this.spamRepo.findOne({ where: { user } });
        let newList = spam[list];
        if (!spam[list].includes(addedId)) {
            newList = [...spam[list], addedId];
        }
        if (pop && list === 'decline_list') {
            const tempList = newList.slice();
            tempList.shift();
            newList = tempList;
        }
        spam[list] = newList;
        return this.spamRepo.save(spam);
    }
};
MatchingSpamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(matching_spams_entity_1.MatchingSpams)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], MatchingSpamService);
exports.MatchingSpamService = MatchingSpamService;
//# sourceMappingURL=matching_spam.service.js.map