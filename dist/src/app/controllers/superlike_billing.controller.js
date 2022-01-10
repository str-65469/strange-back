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
exports.SuperLikeBillingController = void 0;
const paypal = require("@paypal/checkout-server-sdk");
const common_1 = require("@nestjs/common");
const paypal_payment_details_service_1 = require("../services/core/paypal_payment_details.service");
const superlike_service_1 = require("../services/core/superlike/superlike.service");
const superlike_services_1 = require("../common/enum/superlike_services");
const jwt_access_guard_1 = require("../security/guards/jwt_access.guard");
const payment_type_enum_1 = require("../common/enum/payment_type.enum");
const superlike_payment_service_1 = require("../services/core/superlike/superlike_payment.service");
const user_belongings_service_1 = require("../services/core/user/user_belongings.service");
const users_service_1 = require("../services/core/user/users.service");
const general_exception_1 = require("../common/exceptions/general.exception");
const exception_message_code_enum_1 = require("../common/enum/message_codes/exception_message_code.enum");
let SuperLikeBillingController = class SuperLikeBillingController {
    constructor(userService, superLikeService, superlikePaymentService, paypalPaymentDetailsService, userBelongingsService) {
        this.userService = userService;
        this.superLikeService = superLikeService;
        this.superlikePaymentService = superlikePaymentService;
        this.paypalPaymentDetailsService = paypalPaymentDetailsService;
        this.userBelongingsService = userBelongingsService;
    }
    async createOrder(type) {
        const packet = await this.superLikeService.findByType(type);
        console.log(process.env.NODE_ENV);
        console.log(process.env.PAYPAL_CLIENT_ID);
        console.log(process.env.PAYPAL_SECRET_ID);
        const Enviroment = process.env.NODE_ENV === 'production' ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment;
        const paypalClient = new paypal.core.PayPalHttpClient(new Enviroment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET_ID));
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: packet.price,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: packet.price,
                            },
                        },
                    },
                },
            ],
        });
        try {
            const order = await paypalClient.execute(request);
            console.log('================================= created');
            console.log(order);
            return {
                order,
                id: order.result.id,
            };
        }
        catch (error) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.EXPECTATION_FAILED, exception_message_code_enum_1.ExceptionMessageCode.PAYPAL_ORDER_ERROR);
        }
    }
    async captureOrder(orderId, type, req) {
        var _a, _b, _c, _d;
        const userId = await this.userService.userID(req);
        const packet = await this.superLikeService.findByType(type);
        const Enviroment = process.env.NODE_ENV === 'production' ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment;
        const paypalClient = new paypal.core.PayPalHttpClient(new Enviroment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET_ID));
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        console.log('starting');
        try {
            const capture = await paypalClient.execute(request);
            console.log('================================= captured');
            console.log(capture);
            const captureID = (_d = (_c = (_b = (_a = capture === null || capture === void 0 ? void 0 : capture.result) === null || _a === void 0 ? void 0 : _a.purchase_units[0]) === null || _b === void 0 ? void 0 : _b.payments) === null || _c === void 0 ? void 0 : _c.captures[0]) === null || _d === void 0 ? void 0 : _d.id;
            await this.paypalPaymentDetailsService.save(userId, captureID, capture);
            await this.userBelongingsService.update(userId, packet.amount);
            await this.superlikePaymentService.create(packet.amount, type, payment_type_enum_1.PaymentType.PAYPAL, userId);
            return { msg: 'successfull payment' };
        }
        catch (error) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.EXPECTATION_FAILED, exception_message_code_enum_1.ExceptionMessageCode.PAYPAL_PAYMENT_ERROR);
        }
    }
};
__decorate([
    (0, common_1.Get)('paypal/create-order/:type'),
    __param(0, (0, common_1.Param)('type', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SuperLikeBillingController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('paypal/capture-order/:orderId/:type'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Param)('type', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], SuperLikeBillingController.prototype, "captureOrder", null);
SuperLikeBillingController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAcessTokenAuthGuard),
    (0, common_1.Controller)('superlike'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        superlike_service_1.SuperlikeService,
        superlike_payment_service_1.SuperlikePaymentService,
        paypal_payment_details_service_1.PaypalPaymentDetailsService,
        user_belongings_service_1.UserBelongingsService])
], SuperLikeBillingController);
exports.SuperLikeBillingController = SuperLikeBillingController;
//# sourceMappingURL=superlike_billing.controller.js.map