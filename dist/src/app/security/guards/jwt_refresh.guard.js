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
exports.JwtRefreshTokenAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("../../../configs/config");
const cookie_service_1 = require("../../services/common/cookie.service");
const jwt_access_service_1 = require("../../services/common/jwt_access.service");
const users_service_1 = require("../../services/core/user/users.service");
const general_exception_1 = require("../../common/exceptions/general.exception");
const exception_message_code_enum_1 = require("../../common/enum/message_codes/exception_message_code.enum");
let JwtRefreshTokenAuthGuard = class JwtRefreshTokenAuthGuard {
    constructor(jwtAcessService, jwtService, userService, cookieService) {
        this.jwtAcessService = jwtAcessService;
        this.jwtService = jwtService;
        this.userService = userService;
        this.cookieService = cookieService;
    }
    async canActivate(context) {
        const http = context.switchToHttp();
        const cookies = http.getRequest().cookies;
        const response = http.getResponse();
        const accessToken = cookies === null || cookies === void 0 ? void 0 : cookies.access_token;
        const refreshToken = cookies === null || cookies === void 0 ? void 0 : cookies.refresh_token;
        if (!accessToken) {
            this.cookieService.clearCookie(response);
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.ACCESS_TOKEN_MISSING, config_1.configs.messages.exceptions.accessTokenMissing);
        }
        if (!refreshToken) {
            this.cookieService.clearCookie(response);
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.REFRESH_TOKEN_MISSING, config_1.configs.messages.exceptions.refreshTokenMissing);
        }
        const accessTokenDecoded = this.jwtService.decode(accessToken);
        const id = accessTokenDecoded.id;
        const user = await this.userService.findOne(id);
        const secret = user === null || user === void 0 ? void 0 : user.secret;
        if (!user) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.NOT_FOUND, exception_message_code_enum_1.ExceptionMessageCode.USER_NOT_FOUND);
        }
        const jwtPayload = await this.jwtAcessService.validateToken({
            token: refreshToken,
            secret: secret,
        });
        return true;
    }
};
JwtRefreshTokenAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_access_service_1.JwtAcessService,
        jwt_1.JwtService,
        users_service_1.UsersService,
        cookie_service_1.CookieService])
], JwtRefreshTokenAuthGuard);
exports.JwtRefreshTokenAuthGuard = JwtRefreshTokenAuthGuard;
//# sourceMappingURL=jwt_refresh.guard.js.map