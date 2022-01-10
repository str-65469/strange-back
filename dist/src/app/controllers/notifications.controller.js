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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_access_guard_1 = require("../security/guards/jwt_access.guard");
const notifications_service_1 = require("../services/core/notifications.service");
const users_service_1 = require("../services/core/user/users.service");
let NotificationsController = class NotificationsController {
    constructor(notificationService, userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }
    async delete(matchId) {
        return await this.notificationService.delete(matchId);
    }
    async updateSeen(matchId) {
        return await this.notificationService.updateMatchedNotification(matchId);
    }
    async updateHiddenSeen(req) {
        const userId = await this.userService.userID(req);
        const result = await this.notificationService.updateAllHiddenSeen(userId);
        return result.affected > 0;
    }
};
__decorate([
    (0, common_1.Post)('matcheds/:matchId'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('matcheds/update/seen/:matchId'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateSeen", null);
__decorate([
    (0, common_1.Get)('matcheds/update/hidden_seen'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateHiddenSeen", null);
NotificationsController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService, users_service_1.UsersService])
], NotificationsController);
exports.NotificationsController = NotificationsController;
//# sourceMappingURL=notifications.controller.js.map