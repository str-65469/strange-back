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
exports.UserForgotPasswordCacheService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const forgot_password_cache_entity_1 = require("../../../../database/entity/forgot_password_cache.entity");
let UserForgotPasswordCacheService = class UserForgotPasswordCacheService {
    constructor(forgotPasswordCacheRepo) {
        this.forgotPasswordCacheRepo = forgotPasswordCacheRepo;
    }
    async delete(id) {
        return await this.forgotPasswordCacheRepo.delete(id);
    }
    async findByEmail(email) {
        return this.forgotPasswordCacheRepo.findOne({ where: { email } });
    }
    async findOne(id) {
        return this.forgotPasswordCacheRepo.findOne(id);
    }
    async save(id, email, summoner_name, uuid) {
        const forgotPasswordCache = this.forgotPasswordCacheRepo.create({
            user_id: id,
            email,
            summoner_name,
            uuid,
        });
        return this.forgotPasswordCacheRepo.save(forgotPasswordCache);
    }
    async update(id, token, secret) {
        return this.forgotPasswordCacheRepo.update(id, {
            secret_token: token,
            secret,
        });
    }
};
UserForgotPasswordCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(forgot_password_cache_entity_1.ForgotPasswordCache)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserForgotPasswordCacheService);
exports.UserForgotPasswordCacheService = UserForgotPasswordCacheService;
//# sourceMappingURL=user_forgot_password.service.js.map