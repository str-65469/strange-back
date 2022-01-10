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
exports.JwtRegisterAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const user_register_cache_service_1 = require("../../services/core/user/user_register_cache.service");
const jwt_access_service_1 = require("../../services/common/jwt_access.service");
const auth_service_1 = require("../../services/core/auth/auth.service");
const general_exception_1 = require("../../common/exceptions/general.exception");
const exception_message_code_enum_1 = require("../../common/enum/message_codes/exception_message_code.enum");
let JwtRegisterAuthGuard = class JwtRegisterAuthGuard {
    constructor(authService, jwtAcessService, userRegisterCacheService) {
        this.authService = authService;
        this.jwtAcessService = jwtAcessService;
        this.userRegisterCacheService = userRegisterCacheService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        ['id', 'secret'].forEach((param) => {
            if (!request.query[param]) {
                throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.QUERY_PARAMETER_MISSING, `query parameter {${param}} is missing`);
            }
        });
        const { id, secret } = request.query;
        const cachedData = await this.authService.retrieveRegisterCachedData(id);
        if (secret !== cachedData.secret_token) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.TOKEN_MISMATCH_ERROR);
        }
        const jwtPayload = await this.jwtAcessService.validateToken({
            token: secret,
            secret: process.env.JWT_REGISTER_CACHE_SECRET,
            expired_clbck: () => this.userRegisterCacheService.delete(id),
        });
        return true;
    }
};
JwtRegisterAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_access_service_1.JwtAcessService,
        user_register_cache_service_1.UserRegisterCacheService])
], JwtRegisterAuthGuard);
exports.JwtRegisterAuthGuard = JwtRegisterAuthGuard;
//# sourceMappingURL=jwt_register.guard.js.map