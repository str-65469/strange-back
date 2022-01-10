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
exports.MailService = exports.SENDER_ADDRESS = void 0;
const common_1 = require("@nestjs/common");
const contact_us_entity_1 = require("../../database/entity/contact_us.entity");
const user_register_cache_entity_1 = require("../../database/entity/user_register_cache.entity");
const contact_us_service_1 = require("./services/contact_us.service");
const register_check_service_1 = require("./services/register_check.service");
const dotenv = require("dotenv");
const forgot_password_service_1 = require("./services/forgot_password.service");
const url_builder_1 = require("../utils/url_builder");
const config_1 = require("../../configs/config");
dotenv.config();
exports.SENDER_ADDRESS = `"${process.env.APP_TITLE} 👻" <${process.env.MAIL_USER}>`;
let MailService = class MailService {
    constructor(registerMailService, contactUsMailService, forgotPasswordMailService) {
        this.registerMailService = registerMailService;
        this.contactUsMailService = contactUsMailService;
        this.forgotPasswordMailService = forgotPasswordMailService;
    }
    async sendUserConfirmation(userCached) {
        const { id, username, secret_token } = userCached;
        const url = (0, url_builder_1.createUrl)(config_1.configs.general.routes.APP_URL, {
            path: `/auth/register/confirm?id=${id}&secret=${secret_token}`,
        });
        return this.registerMailService.sendConfirmationEmail(userCached, { url, username });
    }
    async sendForgotPasswordUUID(email, uuid, username) {
        const properties = {
            uuid,
            username,
        };
        return this.forgotPasswordMailService.sendConfirmationEmail(email, properties);
    }
    async sendContactEmail(contactUsObj) {
        const mailTemplateProps = {
            email: contactUsObj.email,
            message_type: contactUsObj.message_type,
            message: contactUsObj === null || contactUsObj === void 0 ? void 0 : contactUsObj.message,
        };
        return this.contactUsMailService.sendConfirmationEmail(contactUsObj, mailTemplateProps);
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RegisterMailCheck')),
    __param(1, (0, common_1.Inject)('ContactUsMail')),
    __param(2, (0, common_1.Inject)('ForgotPasswordMail')),
    __metadata("design:paramtypes", [register_check_service_1.RegisterMailCheckService,
        contact_us_service_1.ContactUsMailService,
        forgot_password_service_1.ForgotPasswordMailService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map