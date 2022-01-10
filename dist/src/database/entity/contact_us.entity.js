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
exports.ContactUs = void 0;
const contact_us_message_type_enum_1 = require("../../app/common/enum/contact_us_message_type.enum");
const typeorm_1 = require("typeorm");
const general_1 = require("../entity_inheritance/general");
let ContactUs = class ContactUs extends general_1.GeneralEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactUs.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactUs.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ContactUs.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: contact_us_message_type_enum_1.ContactUseMessageTypes }),
    __metadata("design:type", String)
], ContactUs.prototype, "message_type", void 0);
ContactUs = __decorate([
    (0, typeorm_1.Entity)('contact_us')
], ContactUs);
exports.ContactUs = ContactUs;
//# sourceMappingURL=contact_us.entity.js.map