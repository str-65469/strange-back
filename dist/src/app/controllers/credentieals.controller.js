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
exports.CredentialsController = void 0;
const common_1 = require("@nestjs/common");
const credentials_response_1 = require("../common/response/credentials/credentials.response");
const jwt_access_guard_1 = require("../security/guards/jwt_access.guard");
const user_safe_interceptor_1 = require("../security/interceptors/user_safe.interceptor");
const credentials_service_1 = require("../services/core/credentials.service");
let CredentialsController = class CredentialsController {
    constructor(credentialsService) {
        this.credentialsService = credentialsService;
    }
    credentials() {
        return this.credentialsService.credentials();
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseInterceptors)(user_safe_interceptor_1.UserSafeInterceptor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", credentials_response_1.CredentialsResponse)
], CredentialsController.prototype, "credentials", null);
CredentialsController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.Controller)('credentials'),
    __metadata("design:paramtypes", [credentials_service_1.CredentialsService])
], CredentialsController);
exports.CredentialsController = CredentialsController;
//# sourceMappingURL=credentieals.controller.js.map