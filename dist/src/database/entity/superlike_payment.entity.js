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
exports.SuperLikePayment = void 0;
const typeorm_1 = require("typeorm");
const payment_type_enum_1 = require("../../app/common/enum/payment_type.enum");
const general_1 = require("../entity_inheritance/general");
const user_entity_1 = require("./user.entity");
const superlike_services_1 = require("../../app/common/enum/superlike_services");
let SuperLikePayment = class SuperLikePayment extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], SuperLikePayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: superlike_services_1.SuperLikeServiceType }),
    __metadata("design:type", Number)
], SuperLikePayment.prototype, "like_service_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: payment_type_enum_1.PaymentType }),
    __metadata("design:type", String)
], SuperLikePayment.prototype, "payment_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SuperLikePayment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, (user) => user.superLikePayments),
    __metadata("design:type", user_entity_1.default)
], SuperLikePayment.prototype, "user", void 0);
SuperLikePayment = __decorate([
    (0, typeorm_1.Entity)('superlike_payment')
], SuperLikePayment);
exports.SuperLikePayment = SuperLikePayment;
//# sourceMappingURL=superlike_payment.entity.js.map