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
exports.JwtForgotPasswordAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../services/core/auth/auth.service");
const jwt_access_service_1 = require("../../services/common/jwt_access.service");
const config_1 = require("../../../configs/config");
const forgot_password_cache_entity_1 = require("../../../database/entity/forgot_password_cache.entity");
const general_exception_1 = require("../../common/exceptions/general.exception");
const exception_message_code_enum_1 = require("../../common/enum/message_codes/exception_message_code.enum");
let JwtForgotPasswordAuthGuard = class JwtForgotPasswordAuthGuard {
    constructor(authService, jwtAcessService) {
        this.authService = authService;
        this.jwtAcessService = jwtAcessService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.jwtAcessService.getForgotPasswordToken(request.headers);
        const cacheId = this.getCacheIdFromToken(token);
        const cachedData = await this.authService.retrieveForgotPasswordCachedData(cacheId);
        if (cachedData.secret_token !== token) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.TOKEN_MISMATCH_ERROR, config_1.configs.messages.exceptions.forgotPasswordTokenMissMatch);
        }
        await this.jwtAcessService.validateToken({
            secret: cachedData.secret,
            token: cachedData.secret_token,
            expired_clbck: () => {
                this.authService.userForgotPasswordCacheService.delete(cacheId);
                throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.TOKEN_EXPIRED_ERROR, config_1.configs.messages.exceptions.forgotPasswordTokenExpired);
            },
        });
        request.forgotPasswordCache = cachedData;
        return true;
    }
    getCacheIdFromToken(token) {
        if (!token) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.FORGOT_PASSWORD_TOKEN_MISSING, config_1.configs.messages.exceptions.forgotPasswordTokenMissing);
        }
        const tokenDecoded = this.jwtAcessService.jwtService.decode(token);
        const cacheId = tokenDecoded === null || tokenDecoded === void 0 ? void 0 : tokenDecoded.id;
        if (!tokenDecoded) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.TOKEN_ERROR);
        }
        if (Object.values(tokenDecoded).length === 0) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.TOKEN_PAYLOAD_MISSING);
        }
        if (!cacheId) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.TOKEN_PARAMETER_MISSING, config_1.configs.messages.exceptions.forgotPasswordTokenPayloadIdMissing);
        }
        return cacheId;
    }
};
JwtForgotPasswordAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService, jwt_access_service_1.JwtAcessService])
], JwtForgotPasswordAuthGuard);
exports.JwtForgotPasswordAuthGuard = JwtForgotPasswordAuthGuard;
//# sourceMappingURL=jwt_forgot_password.guard.js.map