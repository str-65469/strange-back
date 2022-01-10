"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641584202613 = void 0;
class Main1641584202613 {
    constructor() {
        this.name = 'Main1641584202613';
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
exports.Main1641584202613 = Main1641584202613;
//# sourceMappingURL=1641584202613-Main.js.map