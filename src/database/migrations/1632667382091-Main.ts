import {MigrationInterface, QueryRunner} from "typeorm";

export class Main1632667382091 implements MigrationInterface {
    name = 'Main1632667382091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."another" RENAME COLUMN "username" TO "usernamexxx"`);
        await queryRunner.query(`ALTER TABLE "public"."test" RENAME COLUMN "yyyyyy" TO "yyyyyysahdsaohsaohds"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."test" RENAME COLUMN "yyyyyysahdsaohsaohds" TO "yyyyyy"`);
        await queryRunner.query(`ALTER TABLE "public"."another" RENAME COLUMN "usernamexxx" TO "username"`);
    }

}
