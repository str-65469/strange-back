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
exports.ForgotPasswordMailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../mail.service");
let ForgotPasswordMailService = class ForgotPasswordMailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendConfirmationEmail(to, properties) {
        return await this.mailerService
            .sendMail({
            from: mail_service_1.SENDER_ADDRESS,
            to: to,
            subject: 'Forgot password Strangeelo',
            template: './forgot_password',
            context: properties,
        })
            .catch((err) => {
            console.log('Forgot password Service Error');
            console.log(err);
        });
    }
};
ForgotPasswordMailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], ForgotPasswordMailService);
exports.ForgotPasswordMailService = ForgotPasswordMailService;
//# sourceMappingURL=forgot_password.service.js.map