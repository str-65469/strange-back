"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const path = require("path");
const user_entity_1 = require("../../database/entity/user.entity");
const billing_module_1 = require("./billing.module");
const matching_lobby_entity_1 = require("../../database/entity/matching_lobby.entity");
const reports_controller_1 = require("../controllers/reports.controller");
const matched_duos_entity_1 = require("../../database/entity/matched_duos.entity");
const matched_duos_controller_1 = require("../controllers/matched_duos.controller");
const matched_duos_notifications_entity_1 = require("../../database/entity/matched_duos_notifications.entity");
const notifications_controller_1 = require("../controllers/notifications.controller");
const account_abuse_reports_entity_1 = require("../../database/entity/account_abuse_reports.entity");
const seeder_module_1 = require("../../database/seeders/seeder.module");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("../controllers/app.controller");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("../../configs/typeorm");
const users_module_1 = require("./users.module");
const mail_module_1 = require("../mail/mail.module");
const platform_express_1 = require("@nestjs/platform-express");
const contact_us_entity_1 = require("../../database/entity/contact_us.entity");
const user_details_entity_1 = require("../../database/entity/user_details.entity");
const core_1 = require("@nestjs/core");
const superlike_controller_1 = require("../controllers/superlike.controller");
const user_belongings_entity_1 = require("../../database/entity/user_belongings.entity");
const contact_us_service_1 = require("../services/core/contact_us.service");
const matched_duos_service_1 = require("../services/core/matcheds/matched_duos.service");
const matching_lobby_service_1 = require("../services/core/matcheds/matching_lobby.service");
const notifications_service_1 = require("../services/core/notifications.service");
const reports_service_1 = require("../services/core/reports.service");
const user_belongings_service_1 = require("../services/core/user/user_belongings.service");
const auth_module_1 = require("./auth.module");
const jwt_1 = require("@nestjs/jwt");
const credentieals_controller_1 = require("../controllers/credentieals.controller");
const credentials_service_1 = require("../services/core/credentials.service");
const chat_module_1 = require("./chat.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({}),
            platform_express_1.MulterModule.register({ dest: path.join(__dirname, '../../../../', 'upload') }),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot(typeorm_2.TypeormConfig.instance),
            typeorm_1.TypeOrmModule.forFeature([
                contact_us_entity_1.ContactUs,
                matched_duos_notifications_entity_1.MatchedDuosNotifications,
                matched_duos_entity_1.MatchedDuos,
                user_entity_1.default,
                user_details_entity_1.UserDetails,
                account_abuse_reports_entity_1.AccountAbuseReport,
                matching_lobby_entity_1.MatchingLobby,
                user_belongings_entity_1.UserBelongings,
            ]),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            seeder_module_1.SeederModule,
            billing_module_1.BillingModule,
            chat_module_1.ChatModule,
            core_1.RouterModule.register([
                {
                    path: 'billing',
                    module: billing_module_1.BillingModule,
                },
            ]),
        ],
        controllers: [
            matched_duos_controller_1.MatchedDuosController,
            notifications_controller_1.NotificationsController,
            app_controller_1.AppController,
            reports_controller_1.ReportsController,
            superlike_controller_1.SuperLikeController,
            credentieals_controller_1.CredentialsController,
        ],
        providers: [
            user_belongings_service_1.UserBelongingsService,
            matching_lobby_service_1.MatchingLobbyService,
            matched_duos_service_1.MatchedDuosService,
            notifications_service_1.NotificationsService,
            contact_us_service_1.ContactUsService,
            reports_service_1.ReportsService,
            credentials_service_1.CredentialsService,
        ],
        exports: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map