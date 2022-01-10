"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641404334460 = void 0;
class Main1641404334460 {
    constructor() {
        this.name = 'Main1641404334460';
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
exports.Main1641404334460 = Main1641404334460;
//# sourceMappingURL=1641404334460-Main.js.map