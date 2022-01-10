"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const matched_duos_entity_1 = require("../../database/entity/matched_duos.entity");
const matched_duos_notifications_entity_1 = require("../../database/entity/matched_duos_notifications.entity");
const matching_lobby_entity_1 = require("../../database/entity/matching_lobby.entity");
const matching_spams_entity_1 = require("../../database/entity/matching_spams.entity");
const chat_controller_1 = require("../controllers/chat.controller");
const chat_head_repository_1 = require("../repositories/chat_head.repository");
const chat_messages_repository_1 = require("../repositories/chat_messages.repository");
const chat_participant_repositry_1 = require("../repositories/chat_participant.repositry");
const chat_service_1 = require("../services/core/chat.service");
const chat_head_service_1 = require("../services/core/chat/chat_head.service");
const chat_messages_service_1 = require("../services/core/chat/chat_messages.service");
const chat_participants_service_1 = require("../services/core/chat/chat_participants.service");
const duo_finder_service_1 = require("../services/core/duo_finder.service");
const matched_duos_service_1 = require("../services/core/matcheds/matched_duos.service");
const matching_lobby_service_1 = require("../services/core/matcheds/matching_lobby.service");
const matching_spam_service_1 = require("../services/core/matcheds/matching_spam.service");
const notifications_service_1 = require("../services/core/notifications.service");
const socket_service_1 = require("../services/core/socket.service");
const user_belongings_service_1 = require("../services/core/user/user_belongings.service");
const socket_gateway_1 = require("../socket/socket.gateway");
const users_module_1 = require("./users.module");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            typeorm_1.TypeOrmModule.forFeature([
                chat_participant_repositry_1.ChatParticipantsRepository,
                chat_messages_repository_1.ChatMessagesRepository,
                chat_head_repository_1.ChatHeadRepository,
                matched_duos_entity_1.MatchedDuos,
                matching_lobby_entity_1.MatchingLobby,
                matching_spams_entity_1.MatchingSpams,
                matched_duos_notifications_entity_1.MatchedDuosNotifications,
            ]),
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [
            chat_service_1.ChatService,
            chat_participants_service_1.ChatParticipantsService,
            chat_messages_service_1.ChatMessagesService,
            chat_head_service_1.ChatHeadService,
            socket_service_1.SocketService,
            socket_gateway_1.SocketGateway,
            duo_finder_service_1.DuoFinderService,
            matched_duos_service_1.MatchedDuosService,
            matching_lobby_service_1.MatchingLobbyService,
            notifications_service_1.NotificationsService,
            matching_spam_service_1.MatchingSpamService,
            user_belongings_service_1.UserBelongingsService,
        ],
        exports: [],
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map