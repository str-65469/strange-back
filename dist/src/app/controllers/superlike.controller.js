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
exports.SuperLikeController = void 0;
const common_1 = require("@nestjs/common");
const jwt_access_guard_1 = require("../security/guards/jwt_access.guard");
const users_service_1 = require("../services/core/user/users.service");
const user_belongings_service_1 = require("../services/core/user/user_belongings.service");
let SuperLikeController = class SuperLikeController {
    constructor(userService, userBelongingsService) {
        this.userService = userService;
        this.userBelongingsService = userBelongingsService;
    }
    async fetchSuperLike(req) {
        const userId = this.userService.userID(req);
        const userBelongings = await this.userBelongingsService.find(userId);
        return {
            count: userBelongings.super_like,
        };
    }
};
__decorate([
    (0, common_1.Get)('count'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperLikeController.prototype, "fetchSuperLike", null);
SuperLikeController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.Controller)('superlike'),
    __metadata("design:paramtypes", [users_service_1.UsersService, user_belongings_service_1.UserBelongingsService])
], SuperLikeController);
exports.SuperLikeController = SuperLikeController;
//# sourceMappingURL=superlike.controller.js.map