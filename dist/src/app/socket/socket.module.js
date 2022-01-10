"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketModule = void 0;
const user_entity_1 = require("../../database/entity/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const socket_gateway_1 = require("./socket.gateway");
const duo_finder_service_1 = require("../services/core/duo_finder.service");
const matched_duos_entity_1 = require("../../database/entity/matched_duos.entity");
const matching_lobby_entity_1 = require("../../database/entity/matching_lobby.entity");
const matching_spams_entity_1 = require("../../database/entity/matching_spams.entity");
const user_details_entity_1 = require("../../database/entity/user_details.entity");
const matched_duos_notifications_entity_1 = require("../../database/entity/matched_duos_notifications.entity");
const user_register_cache_entity_1 = require("../../database/entity/user_register_cache.entity");
const user_belongings_service_1 = require("../services/core/user/user_belongings.service");
const user_belongings_entity_1 = require("../../database/entity/user_belongings.entity");
const matching_lobby_service_1 = require("../services/core/matcheds/matching_lobby.service");
const matching_spam_service_1 = require("../services/core/matcheds/matching_spam.service");
const jwt_access_service_1 = require("../services/common/jwt_access.service");
const users_service_1 = require("../services/core/user/users.service");
const notifications_service_1 = require("../services/core/notifications.service");
const matched_duos_service_1 = require("../services/core/matcheds/matched_duos.service");
const config_1 = require("../../configs/config");
const socket_service_1 = require("../services/core/socket.service");
let SocketModule = class SocketModule {
};
SocketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET }),
            axios_1.HttpModule.register({ baseURL: config_1.configs.general.routes.CHECKED_SERVER_URL, timeout: 10000 }),
            typeorm_1.TypeOrmModule.forFeature([
                matched_duos_entity_1.MatchedDuos,
                matching_lobby_entity_1.MatchingLobby,
                matching_spams_entity_1.MatchingSpams,
                user_entity_1.default,
                user_details_entity_1.UserDetails,
                matched_duos_notifications_entity_1.MatchedDuosNotifications,
                user_register_cache_entity_1.UserRegisterCache,
                user_belongings_entity_1.UserBelongings,
            ]),
        ],
        providers: [
            socket_gateway_1.SocketGateway,
            socket_service_1.SocketService,
            user_belongings_service_1.UserBelongingsService,
            jwt_access_service_1.JwtAcessService,
            duo_finder_service_1.DuoFinderService,
            users_service_1.UsersService,
            matched_duos_service_1.MatchedDuosService,
            matching_lobby_service_1.MatchingLobbyService,
            notifications_service_1.NotificationsService,
            matching_spam_service_1.MatchingSpamService,
        ],
        exports: [socket_gateway_1.SocketGateway, socket_service_1.SocketService],
    })
], SocketModule);
exports.SocketModule = SocketModule;
//# sourceMappingURL=socket.module.js.map