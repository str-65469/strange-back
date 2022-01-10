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
exports.UserBelongingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_belongings_entity_1 = require("../../../../database/entity/user_belongings.entity");
const user_entity_1 = require("../../../../database/entity/user.entity");
let UserBelongingsService = class UserBelongingsService {
    constructor(userBelongingsRepo) {
        this.userBelongingsRepo = userBelongingsRepo;
    }
    find(userId) {
        return this.userBelongingsRepo.findOneOrFail({
            where: { userId },
        });
    }
    create(user) {
        const userBelonging = this.userBelongingsRepo.create({ user });
        return this.userBelongingsRepo.save(userBelonging);
    }
    async update(userId, amount) {
        const userBelonging = await this.userBelongingsRepo.findOneOrFail({
            where: {
                userId: userId,
            },
        });
        userBelonging.super_like = userBelonging.super_like + amount;
        return this.userBelongingsRepo.save(userBelonging);
    }
    async decreaseSuperLike(userId, amount) {
        const userBelonging = await this.userBelongingsRepo.findOneOrFail({
            where: {
                userId: userId,
            },
        });
        if (userBelonging.super_like && userBelonging.super_like > 0) {
            userBelonging.super_like = userBelonging.super_like - amount;
        }
        return this.userBelongingsRepo.save(userBelonging);
    }
};
UserBelongingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_belongings_entity_1.UserBelongings)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserBelongingsService);
exports.UserBelongingsService = UserBelongingsService;
//# sourceMappingURL=user_belongings.service.js.map