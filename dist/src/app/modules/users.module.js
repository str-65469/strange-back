"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const user_entity_1 = require("../../database/entity/user.entity");
const user_register_cache_entity_1 = require("../../database/entity/user_register_cache.entity");
const jwt_access_service_1 = require("../services/common/jwt_access.service");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_details_entity_1 = require("../../database/entity/user_details.entity");
const platform_express_1 = require("@nestjs/platform-express");
const user_files_controller_1 = require("../controllers/user_files.controller");
const axios_1 = require("@nestjs/axios");
const mail_module_1 = require("../mail/mail.module");
const cookie_service_1 = require("../services/common/cookie.service");
const matching_spams_entity_1 = require("../../database/entity/matching_spams.entity");
const matching_spam_service_1 = require("../services/core/matcheds/matching_spam.service");
const user_controller_1 = require("../controllers/user.controller");
const users_service_1 = require("../services/core/user/users.service");
const config_1 = require("../../configs/config");
const user_belongings_entity_1 = require("../../database/entity/user_belongings.entity");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mail_module_1.MailModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.default, user_details_entity_1.UserDetails, user_belongings_entity_1.UserBelongings, user_register_cache_entity_1.UserRegisterCache, matching_spams_entity_1.MatchingSpams]),
            jwt_1.JwtModule.register({ secret: process.env.JWT_REGISTER_CACHE_SECRET }),
            platform_express_1.MulterModule.register({ dest: './upload' }),
            axios_1.HttpModule.register({ baseURL: config_1.configs.general.routes.CHECKED_SERVER_URL, timeout: 10000 }),
        ],
        controllers: [user_controller_1.UserController, user_files_controller_1.UserFileController],
        providers: [users_service_1.UsersService, jwt_access_service_1.JwtAcessService, cookie_service_1.CookieService, matching_spam_service_1.MatchingSpamService],
        exports: [
            typeorm_1.TypeOrmModule,
            users_service_1.UsersService,
            jwt_access_service_1.JwtAcessService,
            cookie_service_1.CookieService,
            axios_1.HttpModule,
            mail_module_1.MailModule,
            matching_spam_service_1.MatchingSpamService,
        ],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map