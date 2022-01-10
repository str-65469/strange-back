"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1640113573574 = void 0;
class Main1640113573574 {
    constructor() {
        this.name = 'Main1640113573574';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" DROP COLUMN "expiry_date"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."forgot_password_cache" ADD "expiry_date" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }
}
exports.Main1640113573574 = Main1640113573574;
//# sourceMappingURL=1640113573574-Main.js.map