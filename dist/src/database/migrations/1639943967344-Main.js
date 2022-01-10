"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1639943967344 = void 0;
class Main1639943967344 {
    constructor() {
        this.name = 'Main1639943967344';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ADD CONSTRAINT "UQ_fa076f0d1630e96336148e685ea" UNIQUE ("username")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" DROP CONSTRAINT "UQ_fa076f0d1630e96336148e685ea"`);
    }
}
exports.Main1639943967344 = Main1639943967344;
//# sourceMappingURL=1639943967344-Main.js.map