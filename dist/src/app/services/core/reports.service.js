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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_abuse_reports_entity_1 = require("../../../database/entity/account_abuse_reports.entity");
const typeorm_2 = require("typeorm");
const file_helper_1 = require("../../utils/file_helper");
let ReportsService = class ReportsService {
    constructor(reportRepo) {
        this.reportRepo = reportRepo;
    }
    async save(data, profileImageId, email) {
        const { server, summonerName } = data;
        const report = this.reportRepo.create({
            server,
            summoner_name: summonerName,
            imagePath: file_helper_1.FileHelper.profileImagePath(profileImageId),
            email,
        });
        return await this.reportRepo.save(report);
    }
};
ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(account_abuse_reports_entity_1.AccountAbuseReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReportsService);
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map