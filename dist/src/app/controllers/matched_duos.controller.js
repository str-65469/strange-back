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
exports.MatchedDuosController = void 0;
const common_1 = require("@nestjs/common");
const jwt_access_guard_1 = require("../security/guards/jwt_access.guard");
const matched_duos_service_1 = require("../services/core/matcheds/matched_duos.service");
const users_service_1 = require("../services/core/user/users.service");
let MatchedDuosController = class MatchedDuosController {
    constructor(matchedDuosService, userService) {
        this.matchedDuosService = matchedDuosService;
        this.userService = userService;
    }
    async getMatchedDuos(lastId = null, req) {
        const userId = this.userService.userID(req);
        const user = await this.userService.user(userId);
        if (lastId) {
            return await this.matchedDuosService.get(user, lastId);
        }
        return await this.matchedDuosService.get(user);
    }
};
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('lastId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchedDuosController.prototype, "getMatchedDuos", null);
MatchedDuosController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.Controller)('matcheds'),
    __metadata("design:paramtypes", [matched_duos_service_1.MatchedDuosService, users_service_1.UsersService])
], MatchedDuosController);
exports.MatchedDuosController = MatchedDuosController;
//# sourceMappingURL=matched_duos.controller.js.map