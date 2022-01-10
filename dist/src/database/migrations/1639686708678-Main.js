"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1639686708678 = void 0;
class Main1639686708678 {
    constructor() {
        this.name = 'Main1639686708678';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."report_account_abuse" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "public"."report_account_abuse" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."report_account_abuse" ADD "imagePath" character varying NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."report_account_abuse" DROP COLUMN "imagePath"`);
        await queryRunner.query(`ALTER TABLE "public"."report_account_abuse" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "public"."report_account_abuse" ADD "imageId" integer`);
    }
}
exports.Main1639686708678 = Main1639686708678;
//# sourceMappingURL=1639686708678-Main.js.map