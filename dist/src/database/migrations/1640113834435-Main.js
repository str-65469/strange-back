"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1640113834435 = void 0;
class Main1640113834435 {
    constructor() {
        this.name = 'Main1640113834435';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" DROP COLUMN "server"`);
        await queryRunner.query(`DROP TYPE "public"."forgot_password_cache_server_enum"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."forgot_password_cache_server_enum" AS ENUM('NA', 'BR', 'OCE', 'RU', 'TR', 'JP', 'SEA', 'LAN', 'LAS', 'KR', 'CN', 'EUW', 'EUNE')`);
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ADD "server" "public"."forgot_password_cache_server_enum" NOT NULL`);
    }
}
exports.Main1640113834435 = Main1640113834435;
//# sourceMappingURL=1640113834435-Main.js.map