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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const account_abues_dto_1 = require("../common/request/account_abues.dto");
const reports_service_1 = require("../services/core/reports.service");
const users_service_1 = require("../services/core/user/users.service");
const file_helper_1 = require("../utils/file_helper");
const general_helper_1 = require("../utils/general.helper");
let ReportsController = class ReportsController {
    constructor(reportSerice, userService) {
        this.reportSerice = reportSerice;
        this.userService = userService;
    }
    async check(data) {
        const { server, summonerName, email } = data;
        const checkedLolCreds = await this.userService.checkLolCredentialsValid(server, summonerName);
        const picturesArr = general_helper_1.GeneralHelper.range(0, 10);
        const userPictureId = checkedLolCreds.profileImageId;
        const validPictures = picturesArr.filter((el) => el !== userPictureId);
        const randomPictureId = general_helper_1.GeneralHelper.random(validPictures);
        const imagePath = file_helper_1.FileHelper.profileImage(randomPictureId);
        await this.reportSerice.save(data, randomPictureId, email);
        return { imagePath };
    }
};
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('accounts/abuse'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [account_abues_dto_1.AccountAbuseReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "check", null);
ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService, users_service_1.UsersService])
], ReportsController);
exports.ReportsController = ReportsController;
//# sourceMappingURL=reports.controller.js.map