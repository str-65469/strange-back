"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const matching_spams_entity_1 = require("../../database/entity/matching_spams.entity");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_register_cache_entity_1 = require("../../database/entity/user_register_cache.entity");
const user_details_entity_1 = require("../../database/entity/user_details.entity");
const user_belongings_service_1 = require("../services/core/user/user_belongings.service");
const user_belongings_entity_1 = require("../../database/entity/user_belongings.entity");
const matching_spam_service_1 = require("../services/core/matcheds/matching_spam.service");
const user_details_service_1 = require("../services/core/user/user_details.service");
const user_register_cache_service_1 = require("../services/core/user/user_register_cache.service");
const auth_controller_1 = require("../controllers/auth.controller");
const jwt_access_service_1 = require("../services/common/jwt_access.service");
const auth_service_1 = require("../services/core/auth/auth.service");
const users_module_1 = require("./users.module");
const throttler_1 = require("@nestjs/throttler");
const user_forgot_password_service_1 = require("../services/core/user/user_forgot_password.service");
const forgot_password_cache_entity_1 = require("../../database/entity/forgot_password_cache.entity");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            throttler_1.ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET }),
            typeorm_1.TypeOrmModule.forFeature([user_register_cache_entity_1.UserRegisterCache, user_details_entity_1.UserDetails, matching_spams_entity_1.MatchingSpams, user_belongings_entity_1.UserBelongings, forgot_password_cache_entity_1.ForgotPasswordCache]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_access_service_1.JwtAcessService,
            user_details_service_1.UserDetailsServiceService,
            user_register_cache_service_1.UserRegisterCacheService,
            matching_spam_service_1.MatchingSpamService,
            user_belongings_service_1.UserBelongingsService,
            user_forgot_password_service_1.UserForgotPasswordCacheService,
        ],
        exports: [auth_service_1.AuthService, jwt_access_service_1.JwtAcessService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map