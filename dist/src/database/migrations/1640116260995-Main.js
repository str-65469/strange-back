"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1640116260995 = void 0;
class Main1640116260995 {
    constructor() {
        this.name = 'Main1640116260995';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ADD "user_id" integer NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" DROP COLUMN "user_id"`);
    }
}
exports.Main1640116260995 = Main1640116260995;
//# sourceMappingURL=1640116260995-Main.js.map