"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1640107709413 = void 0;
class Main1640107709413 {
    constructor() {
        this.name = 'Main1640107709413';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "forgot_password_cache_server_enum" AS ENUM('NA', 'BR', 'OCE', 'RU', 'TR', 'JP', 'SEA', 'LAN', 'LAS', 'KR', 'CN', 'EUW', 'EUNE')`);
        await queryRunner.query(`CREATE TABLE "forgot_password_cache" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "summoner_name" character varying, "server" "forgot_password_cache_server_enum" NOT NULL, "uuid" character varying NOT NULL, "secret_token" character varying NOT NULL, "expiry_date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_4645dba51ac2596f5e41b2fa3e4" UNIQUE ("email"), CONSTRAINT "PK_cd45aad0fce1a9768170d41dc7f" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "forgot_password_cache"`);
        await queryRunner.query(`DROP TYPE "forgot_password_cache_server_enum"`);
    }
}
exports.Main1640107709413 = Main1640107709413;
//# sourceMappingURL=1640107709413-Main.js.map