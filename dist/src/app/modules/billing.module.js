"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const superlike_billing_controller_1 = require("../controllers/superlike_billing.controller");
const superlike_service_1 = require("../services/core/superlike/superlike.service");
const superlike_services_entity_1 = require("../../database/entity/superlike_services.entity");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users.module");
const superlike_payment_entity_1 = require("../../database/entity/superlike_payment.entity");
const superlike_payment_service_1 = require("../services/core/superlike/superlike_payment.service");
const paypal_payment_details_entity_1 = require("../../database/entity/paypal_payment_details.entity");
const user_belongings_service_1 = require("../services/core/user/user_belongings.service");
const user_belongings_entity_1 = require("../../database/entity/user_belongings.entity");
const paypal_payment_details_service_1 = require("../services/core/paypal_payment_details.service");
let BillingModule = class BillingModule {
};
BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([superlike_services_entity_1.SuperLikeServices, superlike_payment_entity_1.SuperLikePayment, paypal_payment_details_entity_1.PaypalPaymentDetails, user_belongings_entity_1.UserBelongings]),
            users_module_1.UsersModule,
        ],
        controllers: [superlike_billing_controller_1.SuperLikeBillingController],
        providers: [superlike_service_1.SuperlikeService, superlike_payment_service_1.SuperlikePaymentService, paypal_payment_details_service_1.PaypalPaymentDetailsService, user_belongings_service_1.UserBelongingsService],
    })
], BillingModule);
exports.BillingModule = BillingModule;
//# sourceMappingURL=billing.module.js.map