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
exports.UserCommand = void 0;
const nestjs_command_1 = require("nestjs-command");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../database/entity/user.entity");
let UserCommand = class UserCommand {
    async create() {
        const entityManager = (0, typeorm_1.getManager)();
        await entityManager.transaction(async (manager) => {
            const updateQueryType = `ALTER TABLE ${user_entity_1.default.TABLE_NAME} ALTER COLUMN ${user_entity_1.default.IMAGE_COLUMN_NAME} TYPE TEXT;`;
            await manager.query(updateQueryType);
        });
    }
};
__decorate([
    (0, nestjs_command_1.Command)({
        command: 'user:update_image',
        describe: 'update image varchar to text',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserCommand.prototype, "create", null);
UserCommand = __decorate([
    (0, common_1.Injectable)()
], UserCommand);
exports.UserCommand = UserCommand;
//# sourceMappingURL=user.command.js.map