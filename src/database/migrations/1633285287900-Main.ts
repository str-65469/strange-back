import {MigrationInterface, QueryRunner} from "typeorm";

export class Main1633285287900 implements MigrationInterface {
    name = 'Main1633285287900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ADD "secret_token" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" ADD "expiry_date" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" DROP COLUMN "expiry_date"`);
        await queryRunner.query(`ALTER TABLE "public"."user_register_cache" DROP COLUMN "secret_token"`);
    }

}
