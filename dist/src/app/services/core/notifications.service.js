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
exports.NotificationsService = void 0;
const matched_duos_notifications_entity_1 = require("../../../database/entity/matched_duos_notifications.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../../database/entity/user.entity");
let NotificationsService = class NotificationsService {
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    async findOne(id) {
        return await this.notificationRepo.findOne({
            where: { id },
            relations: ['matchedUser'],
        });
    }
    async save(user, matchedUser) {
        const existed = await this.notificationRepo.findOne({
            where: {
                user,
                matchedUser,
            },
        });
        if (existed) {
            return;
        }
        const notification = this.notificationRepo.create({
            user,
            matchedUser,
        });
        return this.notificationRepo.save(notification);
    }
    async delete(id) {
        const res = await this.notificationRepo.createQueryBuilder().delete().where('id = :id', { id }).execute();
        return res.affected > 0;
    }
    async updateMatchedNotification(id) {
        const res = await this.notificationRepo
            .createQueryBuilder()
            .update()
            .set({ is_seen: true })
            .where('id = :id', { id })
            .execute();
        return res.affected > 0;
    }
    updateAllHiddenSeen(userId) {
        return this.notificationRepo.update({ userId }, { is_hidden_seen: true });
    }
    async all(user) {
        return await this.notificationRepo.find({
            where: { user },
            order: { id: 'DESC' },
            relations: ['matchedUser'],
        });
    }
};
NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(matched_duos_notifications_entity_1.MatchedDuosNotifications)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map