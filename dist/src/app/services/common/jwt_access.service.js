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
exports.JwtAcessService = void 0;
const jwt = require("jsonwebtoken");
const user_entity_1 = require("../../../database/entity/user.entity");
const random_generator_1 = require("../../utils/random_generator");
const user_register_cache_entity_1 = require("../../../database/entity/user_register_cache.entity");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const general_exception_1 = require("../../common/exceptions/general.exception");
const config_1 = require("../../../configs/config");
const exception_message_code_enum_1 = require("../../common/enum/message_codes/exception_message_code.enum");
const general_socket_exception_1 = require("../../common/exceptions/general_socket.exception");
let JwtAcessService = class JwtAcessService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    generateAccessToken(user, socketId) {
        const payload = {
            id: user.id,
            username: user.username,
            socket_id: socketId,
        };
        return this.jwtService.sign(payload, { expiresIn: config_1.configs.tokens.access_token });
    }
    generateRefreshToken(user, userSecret) {
        const secret = userSecret !== null && userSecret !== void 0 ? userSecret : random_generator_1.RandomGenerator.randomString();
        const payload = { id: user.id, username: user.username };
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: config_1.configs.tokens.refresh_token,
            secret,
        });
        return { secret, refreshToken };
    }
    generateForgotPasswordToken(id) {
        const secret = random_generator_1.RandomGenerator.randomString();
        const payload = { id };
        const token = this.jwtService.sign(payload, {
            expiresIn: config_1.configs.tokens.user_forgot_password,
            secret,
        });
        return { secret, token };
    }
    async validateToken(params) {
        if (!params.token) {
            if (params === null || params === void 0 ? void 0 : params.is_socket) {
                throw new general_socket_exception_1.GenericSocketException(exception_message_code_enum_1.ExceptionMessageCode.TOKEN_MISSING);
            }
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.TOKEN_MISSING);
        }
        let decodedToken;
        await jwt.verify(params.token, params.secret, async (err, decoded) => {
            if (!err) {
                decodedToken = decoded;
                return null;
            }
            if (err instanceof jwt.TokenExpiredError) {
                if ('expired_clbck' in params)
                    await params.expired_clbck();
                if (params === null || params === void 0 ? void 0 : params.is_socket) {
                    throw new general_socket_exception_1.GenericSocketException(exception_message_code_enum_1.ExceptionMessageCode.TOKEN_EXPIRED_ERROR, err.message);
                }
                throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.TOKEN_EXPIRED_ERROR, err.message);
            }
            if ('clbck' in params)
                await params.clbck();
            if (params === null || params === void 0 ? void 0 : params.is_socket) {
                throw new general_socket_exception_1.GenericSocketException(exception_message_code_enum_1.ExceptionMessageCode.TOKEN_ERROR, err.message);
            }
            if (err instanceof jwt.JsonWebTokenError) {
                throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.TOKEN_ERROR, err.message);
            }
        });
        return decodedToken;
    }
    getForgotPasswordToken(headers) {
        const tokenString = headers['Authorization'] || headers['authorization'] || null;
        if (typeof tokenString === 'string') {
            return tokenString.split(' ').length > 0 ? tokenString.split(' ')[1] : null;
        }
        return null;
    }
};
JwtAcessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JwtAcessService);
exports.JwtAcessService = JwtAcessService;
//# sourceMappingURL=jwt_access.service.js.map