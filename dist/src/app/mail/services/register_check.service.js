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
exports.RegisterMailCheckService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const user_register_cache_entity_1 = require("../../../database/entity/user_register_cache.entity");
const mail_service_1 = require("../mail.service");
let RegisterMailCheckService = class RegisterMailCheckService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendConfirmationEmail(userCached, properties) {
        return await this.mailerService
            .sendMail({
            from: mail_service_1.SENDER_ADDRESS,
            to: userCached.email,
            subject: 'Welcome to Strangeelo! Confirm your Email',
            template: './register_confirmation',
            context: properties,
        })
            .catch((err) => {
            console.log('Register Mail Check Service Error');
            console.log(err);
        });
    }
};
RegisterMailCheckService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], RegisterMailCheckService);
exports.RegisterMailCheckService = RegisterMailCheckService;
//# sourceMappingURL=register_check.service.js.map