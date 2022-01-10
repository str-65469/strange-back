"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641586218116 = void 0;
class Main1641586218116 {
    constructor() {
        this.name = 'Main1641586218116';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."chat_participants" ALTER COLUMN "chat_last_deleted_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "text_message" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "img_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "voice_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "video_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "gif_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "message_type"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "message_type" "public"."chat_messages_message_type_enum" NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "message_type"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "message_type" chat_messages_message_type_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "gif_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "video_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "voice_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "img_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ALTER COLUMN "text_message" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."chat_participants" ALTER COLUMN "chat_last_deleted_at" SET NOT NULL`);
    }
}
exports.Main1641586218116 = Main1641586218116;
//# sourceMappingURL=1641586218116-Main.js.map