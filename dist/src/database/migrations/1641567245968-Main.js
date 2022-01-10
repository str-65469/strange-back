"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641567245968 = void 0;
class Main1641567245968 {
    constructor() {
        this.name = 'Main1641567245968';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "message_type"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "message_type" "public"."chat_messages_message_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_heads" ALTER COLUMN "name" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."chat_heads" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "message_type"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "message_type" chat_messages_message_type_enum NOT NULL`);
    }
}
exports.Main1641567245968 = Main1641567245968;
//# sourceMappingURL=1641567245968-Main.js.map