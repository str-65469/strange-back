"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641653114797 = void 0;
class Main1641653114797 {
    constructor() {
        this.name = 'Main1641653114797';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" RENAME COLUMN "message_type" TO "messageType"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "messageType"`);
        await queryRunner.query(`CREATE TYPE "public"."chat_messages_messagetype_enum" AS ENUM('TEXT', 'IMAGE', 'VOICE', 'VIDEO', 'GIF')`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "messageType" "public"."chat_messages_messagetype_enum" NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "messageType"`);
        await queryRunner.query(`DROP TYPE "public"."chat_messages_messagetype_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "messageType" chat_messages_message_type_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" RENAME COLUMN "messageType" TO "message_type"`);
    }
}
exports.Main1641653114797 = Main1641653114797;
//# sourceMappingURL=1641653114797-Main.js.map