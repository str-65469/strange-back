"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1639944615728 = void 0;
class Main1639944615728 {
    constructor() {
        this.name = 'Main1639944615728';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."user_details" DROP CONSTRAINT "UQ_13e9d77a589406fbb45cf116f31"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."user_details" ADD CONSTRAINT "UQ_13e9d77a589406fbb45cf116f31" UNIQUE ("summoner_name")`);
    }
}
exports.Main1639944615728 = Main1639944615728;
//# sourceMappingURL=1639944615728-Main.js.map