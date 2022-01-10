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
exports.JwtAcessTokenAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const cookie_service_1 = require("../../services/common/cookie.service");
const jwt_access_service_1 = require("../../services/common/jwt_access.service");
const general_exception_1 = require("../../common/exceptions/general.exception");
const exception_message_code_enum_1 = require("../../common/enum/message_codes/exception_message_code.enum");
let JwtAcessTokenAuthGuard = class JwtAcessTokenAuthGuard {
    constructor(jwtAcessService, cookieService) {
        this.jwtAcessService = jwtAcessService;
        this.cookieService = cookieService;
    }
    async canActivate(context) {
        const http = context.switchToHttp();
        const request = http.getRequest();
        const response = http.getResponse();
        const cookies = request.cookies;
        const accessToken = cookies === null || cookies === void 0 ? void 0 : cookies.access_token;
        const refreshToken = cookies === null || cookies === void 0 ? void 0 : cookies.refresh_token;
        if (!accessToken) {
            this.cookieService.clearCookie(response);
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.ACCESS_TOKEN_MISSING);
        }
        if (!refreshToken) {
            this.cookieService.clearCookie(response);
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.REFRESH_TOKEN_MISSING);
        }
        const jwtPayload = await this.jwtAcessService.validateToken({
            token: accessToken,
            secret: process.env.JWT_SECRET,
        });
        request.jwtPayload = jwtPayload;
        return true;
    }
};
JwtAcessTokenAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_access_service_1.JwtAcessService, cookie_service_1.CookieService])
], JwtAcessTokenAuthGuard);
exports.JwtAcessTokenAuthGuard = JwtAcessTokenAuthGuard;
//# sourceMappingURL=jwt_access.guard.js.map