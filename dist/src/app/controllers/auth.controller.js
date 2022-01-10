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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../services/core/auth/auth.service");
const jwt_access_service_1 = require("../services/common/jwt_access.service");
const mail_service_1 = require("../mail/mail.service");
const jwt_register_guard_1 = require("../security/guards/jwt_register.guard");
const jwt_access_guard_1 = require("../security/guards/jwt_access.guard");
const user_belongings_service_1 = require("../services/core/user/user_belongings.service");
const cookie_service_1 = require("../services/common/cookie.service");
const matching_spam_service_1 = require("../services/core/matcheds/matching_spam.service");
const user_login_dto_1 = require("../common/request/user/user_login.dto");
const users_service_1 = require("../services/core/user/users.service");
const user_details_service_1 = require("../services/core/user/user_details.service");
const user_register_cache_service_1 = require("../services/core/user/user_register_cache.service");
const user_register_dto_1 = require("../common/request/user/user_register.dto");
const register_cache_excpetion_filter_1 = require("../common/exception_filters/register_cache.excpetion.filter");
const throttler_1 = require("@nestjs/throttler");
const jwt_refresh_guard_1 = require("../security/guards/jwt_refresh.guard");
const jwt_forgot_password_guard_1 = require("../security/guards/jwt_forgot_password.guard");
const forgot_password_dto_1 = require("../common/request/forgot_password/forgot_password.dto");
const forgot_password_confirm_dto_1 = require("../common/request/forgot_password/forgot_password_confirm.dto");
const class_transformer_1 = require("class-transformer");
const url_builder_1 = require("../utils/url_builder");
const config_1 = require("../../configs/config");
const general_exception_1 = require("../common/exceptions/general.exception");
const exception_message_code_enum_1 = require("../common/enum/message_codes/exception_message_code.enum");
const uuid_1 = require("uuid");
const user_entity_1 = require("../../database/entity/user.entity");
const forgot_password_cache_entity_1 = require("../../database/entity/forgot_password_cache.entity");
let AuthController = class AuthController {
    constructor(cookieService, authService, userService, jwtService, jwtAcessService, mailServie, userDetailsService, userRegisterCacheService, matchingSpamService, userBelongingsService) {
        this.cookieService = cookieService;
        this.authService = authService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.jwtAcessService = jwtAcessService;
        this.mailServie = mailServie;
        this.userDetailsService = userDetailsService;
        this.userRegisterCacheService = userRegisterCacheService;
        this.matchingSpamService = matchingSpamService;
        this.userBelongingsService = userBelongingsService;
    }
    async login(body, res) {
        this.cookieService.clearCookie(res);
        const user = await this.authService.validateUser(body);
        const accessToken = this.jwtAcessService.generateAccessToken(user, user.socket_id);
        const { refreshToken } = this.jwtAcessService.generateRefreshToken(user, user.secret);
        this.cookieService.createCookie(res, accessToken, refreshToken);
        return res.send((0, class_transformer_1.classToPlain)(user));
    }
    async register(body) {
        const { email, summoner_name, server, username } = body;
        await this.authService.usernameEmailExists(email, username);
        await this.authService.usernameEmailExists(email, username, { inCache: true });
        await this.authService.summonerNameAndServerExists(server, summoner_name);
        const checkedLolCreds = await this.userService.checkLolCredentialsValid(server, summoner_name);
        const userCached = await this.userService.cacheUserRegister(body, checkedLolCreds).catch((err) => {
            throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.USER_ALREADY_IN_CACHE);
        });
        this.mailServie.sendUserConfirmation(userCached);
        return { checkedLolCreds, check: true };
    }
    async registerVerify(id, req, res) {
        this.cookieService.clearCookie(res);
        const cachedData = await this.authService.retrieveRegisterCachedData(id);
        const { refreshToken, secret } = this.jwtAcessService.generateRefreshToken(cachedData);
        const ip = req.ip || req.header('x-forwarded-for');
        const user = await this.userService.saveUserByCachedData(cachedData, secret, ip);
        await this.userDetailsService.saveUserDetailsByCachedData(cachedData, user);
        const accessToken = this.jwtAcessService.generateAccessToken(user, user.socket_id);
        await this.userRegisterCacheService.delete(cachedData.id);
        await this.matchingSpamService.createEmptySpam(user);
        await this.userBelongingsService.create(user);
        this.cookieService.createCookie(res, accessToken, refreshToken);
        const redirect = (0, url_builder_1.createUrl)(config_1.configs.general.routes.DASHBOARD_URL, { path: config_1.configs.general.dashboardRoutes.userProfile });
        return res.redirect(redirect);
    }
    async refreshToken(req, res) {
        this.cookieService.clearCookie(res);
        const cookies = req.cookies;
        const accessToken = cookies.access_token;
        const accessTokenDecoded = this.jwtService.decode(accessToken);
        const id = accessTokenDecoded.id;
        const user = await this.userService.findOne(id);
        const accessTokenNew = this.jwtAcessService.generateAccessToken(user, user.socket_id);
        const { refreshToken } = this.jwtAcessService.generateRefreshToken(user, user.secret);
        this.cookieService.createCookie(res, accessTokenNew, refreshToken);
        return res.send({ message: 'token refresh successful' });
    }
    async checkIfAuth() {
        return true;
    }
    async getAccessToken(request) {
        const cookies = request.cookies;
        return cookies === null || cookies === void 0 ? void 0 : cookies.access_token;
    }
    async logout(res) {
        this.cookieService.clearCookie(res);
        return res.send({ message: 'logout successful' });
    }
    async forgotPassword(body) {
        const { email, summoner_name } = body;
        const userCache = (await this.authService.emailExists(email, { inForgotPasswordCache: true }));
        console.log(userCache);
        if (userCache) {
            if (summoner_name !== userCache.summoner_name) {
                throw new general_exception_1.GenericException(common_1.HttpStatus.NOT_FOUND, exception_message_code_enum_1.ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND);
            }
            return {
                token: userCache.secret_token,
            };
        }
        console.log('past');
        const userWithDetails = (await this.authService.emailExists(email));
        if (userWithDetails.details.summoner_name !== summoner_name) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.NOT_FOUND, exception_message_code_enum_1.ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND);
        }
        const uuid = (0, uuid_1.v4)();
        const unfinishedCachedData = await this.authService.userForgotPasswordCacheService.save(userWithDetails.id, email, summoner_name, uuid);
        const { token, secret } = this.jwtAcessService.generateForgotPasswordToken(unfinishedCachedData.id);
        await this.authService.userForgotPasswordCacheService.update(unfinishedCachedData.id, token, secret);
        await this.mailServie.sendForgotPasswordUUID(userWithDetails.email, uuid, userWithDetails.details.summoner_name);
        return {
            token,
            msg: 'uuid code sent',
        };
    }
    async forgotPasswordUpdate(body, req) {
        const { uuid, new_password } = body;
        const forgotPasswordCache = req.forgotPasswordCache;
        if (uuid !== forgotPasswordCache.uuid) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.INCORRECT_UUID);
        }
        await this.authService.userForgotPasswordCacheService.delete(forgotPasswordCache.id);
        await this.userService.updatePassword(forgotPasswordCache.user_id, new_password);
        return {
            msg: 'updated password successfully',
        };
    }
};
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)(60),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_login_dto_1.UserLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)(60),
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_register_dto_1.UserRegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_register_guard_1.JwtRegisterAuthGuard, throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)(60),
    (0, common_1.UseFilters)(register_cache_excpetion_filter_1.RegisterCacheExceptionFilter),
    (0, common_1.Get)('/register/confirm/'),
    __param(0, (0, common_1.Query)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerVerify", null);
__decorate([
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshTokenAuthGuard),
    (0, common_1.Get)('/refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.Get)('/check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkIfAuth", null);
__decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.Get)('/access_token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAccessToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.Post)('/logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('/forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard, jwt_forgot_password_guard_1.JwtForgotPasswordAuthGuard),
    (0, throttler_1.Throttle)(5),
    (0, common_1.Post)('/forgot-password/confirm'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_confirm_dto_1.ForgotPasswordConfirmRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPasswordUpdate", null);
AuthController = __decorate([
    (0, common_1.Controller)('/auth'),
    __metadata("design:paramtypes", [cookie_service_1.CookieService,
        auth_service_1.AuthService,
        users_service_1.UsersService,
        jwt_1.JwtService,
        jwt_access_service_1.JwtAcessService,
        mail_service_1.MailService,
        user_details_service_1.UserDetailsServiceService,
        user_register_cache_service_1.UserRegisterCacheService,
        matching_spam_service_1.MatchingSpamService,
        user_belongings_service_1.UserBelongingsService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map