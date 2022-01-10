"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1640113639823 = void 0;
class Main1640113639823 {
    constructor() {
        this.name = 'Main1640113639823';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ALTER COLUMN "summoner_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ALTER COLUMN "secret_token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ALTER COLUMN "secret" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ALTER COLUMN "secret" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ALTER COLUMN "secret_token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ALTER COLUMN "summoner_name" DROP NOT NULL`);
    }
}
exports.Main1640113639823 = Main1640113639823;
//# sourceMappingURL=1640113639823-Main.js.map