"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641297061830 = void 0;
class Main1641297061830 {
    constructor() {
        this.name = 'Main1641297061830';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "referral_links" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "url_link" character varying NOT NULL, "token" character varying NOT NULL, "secret" character varying NOT NULL, "entered_count" integer NOT NULL, "registered_count" integer NOT NULL, CONSTRAINT "PK_ba9165a54bafa386574ba5a8a6a" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "referral_links"`);
    }
}
exports.Main1641297061830 = Main1641297061830;
//# sourceMappingURL=1641297061830-Main.js.map