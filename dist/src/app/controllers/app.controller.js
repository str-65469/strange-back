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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const contact_us_service_1 = require("../services/core/contact_us.service");
const contact_us_dto_1 = require("../common/request/contact_us.dto");
let AppController = class AppController {
    constructor(contactUsService) {
        this.contactUsService = contactUsService;
    }
    test() {
        return 'welcome curious user congrats to making here, now please dont poke around here its dangerous';
    }
    async contactUs(body) {
        return await this.contactUsService.contactUs(body);
    }
};
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('/contact_us'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_us_dto_1.ContactUsDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "contactUs", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [contact_us_service_1.ContactUsService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map