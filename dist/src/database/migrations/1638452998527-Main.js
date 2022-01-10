"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1638452998527 = void 0;
class Main1638452998527 {
    constructor() {
        this.name = 'Main1638452998527';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."matched_duos_notifications" ADD "is_hidden_seen" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."matched_duos_notifications" DROP COLUMN "is_hidden_seen"`);
    }
}
exports.Main1638452998527 = Main1638452998527;
//# sourceMappingURL=1638452998527-Main.js.map