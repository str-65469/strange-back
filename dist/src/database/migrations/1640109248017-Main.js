"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1640109248017 = void 0;
class Main1640109248017 {
    constructor() {
        this.name = 'Main1640109248017';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ADD "secret" character varying NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" DROP COLUMN "secret"`);
    }
}
exports.Main1640109248017 = Main1640109248017;
//# sourceMappingURL=1640109248017-Main.js.map