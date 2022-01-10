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
exports.AuthService = void 0;
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../../../database/entity/user.entity");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../user/users.service");
const user_details_service_1 = require("../user/user_details.service");
const user_login_dto_1 = require("../../../common/request/user/user_login.dto");
const user_register_cache_service_1 = require("../user/user_register_cache.service");
const lol_server_enum_1 = require("../../../common/enum/lol_server.enum");
const user_forgot_password_service_1 = require("../user/user_forgot_password.service");
const general_exception_1 = require("../../../common/exceptions/general.exception");
const exception_message_code_enum_1 = require("../../../common/enum/message_codes/exception_message_code.enum");
let AuthService = class AuthService {
    constructor(userService, userDetailsService, userRegisterCacheService, userForgotPasswordCacheService) {
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.userRegisterCacheService = userRegisterCacheService;
        this.userForgotPasswordCacheService = userForgotPasswordCacheService;
    }
    async validateUser(userCredentials) {
        const user = await this.userService.findOneByEmail(userCredentials.email, { fetchPassword: true });
        if (!user) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.NOT_FOUND, exception_message_code_enum_1.ExceptionMessageCode.USER_EMAIL_OR_PASSWORD_INCORRECT);
        }
        const isPasswordMatch = await bcrypt.compare(userCredentials.password, user.password);
        if (!isPasswordMatch) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.NOT_FOUND, exception_message_code_enum_1.ExceptionMessageCode.USER_EMAIL_OR_PASSWORD_INCORRECT);
        }
        return user;
    }
    async usernameEmailExists(email, username, opts) {
        let user = null;
        if (opts === null || opts === void 0 ? void 0 : opts.inCache) {
            user = await this.userRegisterCacheService.findByEmailOrUsername(email, username);
        }
        else {
            user = await this.userService.findByEmailOrUsername(email, username);
        }
        if (user) {
            if (user.email === email) {
                throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.USER_EMAIL_ALREADY_IN_USE);
            }
            if (user.username === username) {
                throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.USERNAME_ALREADY_IN_USE);
            }
        }
        return user;
    }
    async emailExists(email, opts) {
        if (opts === null || opts === void 0 ? void 0 : opts.inForgotPasswordCache) {
            const user = await this.userForgotPasswordCacheService.findByEmail(email);
            return user;
        }
        const user = await this.userService.findOneByEmail(email, { fetchDetails: true });
        if (!user) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.NOT_FOUND, exception_message_code_enum_1.ExceptionMessageCode.USER_NOT_FOUND);
        }
        return user;
    }
    async summonerNameAndServerExists(server, summonerName) {
        const userDetails = await this.userDetailsService.findBySummonerAndServer(server, summonerName);
        if (userDetails) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.SUMMONER_NAME_ALREADY_IN_USE);
        }
    }
    async retrieveRegisterCachedData(id) {
        const cachedData = await this.userRegisterCacheService.findOne(id);
        if (!cachedData) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.REGISTER_CACHE_NOT_FOUND);
        }
        return cachedData;
    }
    async retrieveForgotPasswordCachedData(id) {
        const cachedData = await this.userForgotPasswordCacheService.findOne(id);
        if (!cachedData) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.FORGOT_PASSWORD_CACHE_NOT_FOUND);
        }
        return cachedData;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        user_details_service_1.UserDetailsServiceService,
        user_register_cache_service_1.UserRegisterCacheService,
        user_forgot_password_service_1.UserForgotPasswordCacheService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map