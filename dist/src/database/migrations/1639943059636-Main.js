"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1639943059636 = void 0;
class Main1639943059636 {
    constructor() {
        this.name = 'Main1639943059636';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ADD CONSTRAINT "UQ_7f2a2958cee68eb401f2471525b" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ALTER COLUMN "server" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ALTER COLUMN "secret_token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ALTER COLUMN "expiry_date" SET NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ALTER COLUMN "expiry_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ALTER COLUMN "secret_token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ALTER COLUMN "server" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" DROP CONSTRAINT "UQ_7f2a2958cee68eb401f2471525b"`);
    }
}
exports.Main1639943059636 = Main1639943059636;
//# sourceMappingURL=1639943059636-Main.js.map