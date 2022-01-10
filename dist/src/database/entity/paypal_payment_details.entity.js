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
exports.PaypalPaymentDetails = void 0;
const typeorm_1 = require("typeorm");
const general_1 = require("../entity_inheritance/general");
const user_entity_1 = require("./user.entity");
let PaypalPaymentDetails = class PaypalPaymentDetails extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaypalPaymentDetails.prototype, "captureId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", String)
], PaypalPaymentDetails.prototype, "paymentJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PaypalPaymentDetails.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.superLikePayments),
    __metadata("design:type", user_entity_1.default)
], PaypalPaymentDetails.prototype, "user", void 0);
PaypalPaymentDetails = __decorate([
    (0, typeorm_1.Entity)('paypal_payment_details')
], PaypalPaymentDetails);
exports.PaypalPaymentDetails = PaypalPaymentDetails;
//# sourceMappingURL=paypal_payment_details.entity.js.map