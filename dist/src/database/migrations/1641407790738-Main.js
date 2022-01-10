"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641407790738 = void 0;
class Main1641407790738 {
    constructor() {
        this.name = 'Main1641407790738';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "is_online" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "message_type"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "message_type" "public"."chat_messages_message_type_enum" NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" DROP COLUMN "message_type"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_messages" ADD "message_type" chat_messages_message_type_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "is_online" DROP DEFAULT`);
    }
}
exports.Main1641407790738 = Main1641407790738;
//# sourceMappingURL=1641407790738-Main.js.map