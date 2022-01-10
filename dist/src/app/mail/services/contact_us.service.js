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
exports.ContactUsMailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const contact_us_entity_1 = require("../../../database/entity/contact_us.entity");
const contact_us_message_type_enum_1 = require("../../common/enum/contact_us_message_type.enum");
let ContactUsMailService = class ContactUsMailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendConfirmationEmail(contactUs, properties) {
        return await this.mailerService
            .sendMail({
            from: contactUs.name,
            to: process.env.MAIL_USER,
            subject: 'Contact Us Strangeelo',
            template: './contact_us',
            context: properties,
        })
            .catch((err) => {
            console.log('Contact Us Service Error');
            console.log(err);
        });
    }
};
ContactUsMailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], ContactUsMailService);
exports.ContactUsMailService = ContactUsMailService;
//# sourceMappingURL=contact_us.service.js.map