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
exports.GeneralCommand = void 0;
const nestjs_command_1 = require("nestjs-command");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const matched_duos_entity_1 = require("../../database/entity/matched_duos.entity");
const matched_duos_notifications_entity_1 = require("../../database/entity/matched_duos_notifications.entity");
const matching_lobby_entity_1 = require("../../database/entity/matching_lobby.entity");
const matching_spams_entity_1 = require("../../database/entity/matching_spams.entity");
const chat_participants_entity_1 = require("../../database/entity/chat/chat_participants.entity");
const chat_messages_entity_1 = require("../../database/entity/chat/chat_messages.entity");
const chat_heads_entity_1 = require("../../database/entity/chat/chat_heads.entity");
let GeneralCommand = class GeneralCommand {
    constructor(connection) {
        this.connection = connection;
    }
    async cleanall() {
        if (process.env.NODE_ENV !== 'development') {
            console.log('not so fast');
        }
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const matchingSpams = await this.setEmptyBuilder(queryRunner, matching_spams_entity_1.MatchingSpams, 'spams').execute();
            const matchedDuos = await this.deleteAllBuilder(queryRunner, matched_duos_entity_1.MatchedDuos).execute();
            const notifications = await this.deleteAllBuilder(queryRunner, matched_duos_notifications_entity_1.MatchedDuosNotifications).execute();
            const matchingLobby = await this.deleteAllBuilder(queryRunner, matching_lobby_entity_1.MatchingLobby).execute();
            const chatParticipants = await this.deleteAllBuilder(queryRunner, chat_participants_entity_1.ChatParticipants).execute();
            const chatMessages = await this.deleteAllBuilder(queryRunner, chat_messages_entity_1.ChatMessages).execute();
            const chatHeads = await this.deleteAllBuilder(queryRunner, chat_heads_entity_1.ChatHeads).execute();
            this.perfectLog({
                matchingSpams,
                matchedDuos,
                notifications,
                matchingLobby,
                chatParticipants,
                chatMessages,
                chatHeads,
            });
            await queryRunner.commitTransaction();
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    deleteAllBuilder(queryRunner, entity) {
        return queryRunner.manager.getRepository(entity).createQueryBuilder().delete().where('id > 0');
    }
    setEmptyBuilder(queryRunner, entity, type) {
        if (type === 'spams') {
            return queryRunner.manager
                .getRepository(entity)
                .createQueryBuilder()
                .update()
                .set({ accept_list: [], decline_list: [], remove_list: [], matched_list: [] });
        }
    }
    perfectLog(values) {
        console.log('='.repeat(30));
        console.log(Object.values(values));
        console.log('='.repeat(30));
        console.table(values);
    }
    areYouSure() {
    }
};
__decorate([
    (0, nestjs_command_1.Command)({
        command: 'cleanall',
        describe: 'clean all matching spams matched duos notifications and lobby from database',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GeneralCommand.prototype, "cleanall", null);
GeneralCommand = __decorate([
    (0, common_1.Injectable)({}),
    __metadata("design:paramtypes", [typeorm_1.Connection])
], GeneralCommand);
exports.GeneralCommand = GeneralCommand;
//# sourceMappingURL=general.command.js.map