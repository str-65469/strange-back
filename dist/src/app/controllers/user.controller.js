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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const jwt_access_guard_1 = require("../security/guards/jwt_access.guard");
const users_service_1 = require("../services/core/user/users.service");
const user_safe_interceptor_1 = require("../security/interceptors/user_safe.interceptor");
const user_update_password_dto_1 = require("../common/request/user/user_update_password.dto");
const user_update_dto_1 = require("../common/request/user/user_update.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async user(req) {
        const id = this.userService.userID(req);
        return await this.userService.getUserDetails(id);
    }
    async userProfileUpdate(req, data) {
        const id = this.userService.userID(req);
        return await this.userService.updateUserProfile(id, data);
    }
    async updatePassword(req, data) {
        const id = this.userService.userID(req);
        return this.userService.updateUserCredentials(id, data);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "user", null);
__decorate([
    (0, common_1.Post)('/profile/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_update_dto_1.UserProfileUpdateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userProfileUpdate", null);
__decorate([
    (0, common_1.Put)('/profile/update-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_update_password_dto_1.UserPasswordUpdateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
UserController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.UseInterceptors)(user_safe_interceptor_1.UserSafeInterceptor),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map