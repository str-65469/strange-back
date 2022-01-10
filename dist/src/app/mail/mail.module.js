"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const path = require("path");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const register_check_service_1 = require("./services/register_check.service");
const contact_us_service_1 = require("./services/contact_us.service");
const mailer_1 = require("@nestjs-modules/mailer");
const mail_service_1 = require("./mail.service");
const common_1 = require("@nestjs/common");
const forgot_password_service_1 = require("./services/forgot_password.service");
let MailModule = class MailModule {
};
MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    secure: JSON.parse(process.env.MAIL_USE_TLS),
                    port: JSON.parse(process.env.MAIL_PORT),
                    logger: JSON.parse(process.env.MAIL_LOG),
                    pool: JSON.parse(process.env.MAIL_POOL),
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                    },
                },
                template: {
                    dir: path.join(__dirname, '../../../../public/mail/templates'),
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: { strict: true },
                },
            }),
        ],
        providers: [
            mail_service_1.MailService,
            {
                provide: 'RegisterMailCheck',
                useClass: register_check_service_1.RegisterMailCheckService,
            },
            {
                provide: 'ContactUsMail',
                useClass: contact_us_service_1.ContactUsMailService,
            },
            {
                provide: 'ForgotPasswordMail',
                useClass: forgot_password_service_1.ForgotPasswordMailService,
            },
        ],
        exports: [mail_service_1.MailService],
    })
], MailModule);
exports.MailModule = MailModule;
//# sourceMappingURL=mail.module.js.map