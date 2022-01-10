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
exports.PaypalPaymentDetailsService = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const paypal_payment_details_entity_1 = require("../../../database/entity/paypal_payment_details.entity");
(0, common_1.Injectable)();
let PaypalPaymentDetailsService = class PaypalPaymentDetailsService {
    constructor(paypalPaymentDetailsRepo) {
        this.paypalPaymentDetailsRepo = paypalPaymentDetailsRepo;
    }
    save(userId, captureId, paymentJson) {
        const paypalPaymentDetail = this.paypalPaymentDetailsRepo.create({
            captureId,
            userId,
            paymentJson,
        });
        return this.paypalPaymentDetailsRepo.save(paypalPaymentDetail);
    }
};
PaypalPaymentDetailsService = __decorate([
    __param(0, (0, typeorm_2.InjectRepository)(paypal_payment_details_entity_1.PaypalPaymentDetails)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], PaypalPaymentDetailsService);
exports.PaypalPaymentDetailsService = PaypalPaymentDetailsService;
//# sourceMappingURL=paypal_payment_details.service.js.map