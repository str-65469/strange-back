import {MigrationInterface, QueryRunner} from "typeorm";

export class Main1632664211640 implements MigrationInterface {
    name = 'Main1632664211640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "another" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "username1" character varying NOT NULL, "username2" character varying NOT NULL, "username3" character varying NOT NULL, "username4" character varying NOT NULL, "username5" character varying NOT NULL, "username6" character varying NOT NULL, CONSTRAINT "PK_c64ac15cd95eed391a24f6058b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "test" ("xxxx" SERIAL NOT NULL, "yyyyyy" character varying NOT NULL, CONSTRAINT "PK_07096492b86f58d1a9eec0603c6" PRIMARY KEY ("xxxx"))`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "is_active"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "is_active" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "test"`);
        await queryRunner.query(`DROP TABLE "another"`);
    }

}
