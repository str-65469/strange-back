"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641585207648 = void 0;
class Main1641585207648 {
    constructor() {
        this.name = 'Main1641585207648';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "message_type"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "message_type" "public"."chat_messages_message_type_enum" NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "message_type"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "message_type" chat_messages_message_type_enum NOT NULL`);
    }
}
exports.Main1641585207648 = Main1641585207648;
//# sourceMappingURL=1641585207648-Main.js.map