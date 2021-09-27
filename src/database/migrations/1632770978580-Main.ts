import {MigrationInterface, QueryRunner} from "typeorm";

export class Main1632770978580 implements MigrationInterface {
    name = 'Main1632770978580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "refresh_token" character varying NOT NULL, "secret" character varying NOT NULL, "is_online" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_us" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "message" text NOT NULL, "message_type" "contact_us_message_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_b61766a4d93470109266b976cfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "duo_statuses" ("id" SERIAL NOT NULL, "status" "duo_statuses_status_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "desired_user_id" integer, CONSTRAINT "PK_5fa06f68a33c6dbc5a44bd8a32c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "matched_duos" ("id" SERIAL NOT NULL, "is_favorite" boolean NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "matched_user_id" integer, CONSTRAINT "PK_954859a0f690a8189d26274c860" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "matching_spams" ("id" SERIAL NOT NULL, "accept_list" integer array NOT NULL, "decline_list" integer array NOT NULL, "remove_list" integer array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_7984b41d621d2206aa41f769a34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "superlike_payment" ("id" SERIAL NOT NULL, "amount" double precision NOT NULL, "like_service_type" "superlike_payment_like_service_type_enum" NOT NULL, "payment_type" "superlike_payment_payment_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_a3b68462042f105872ef4c3b160" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_belongings" ("id" SERIAL NOT NULL, "super_like" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_dfefeee03954de90e72217c1160" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_details" ("id" SERIAL NOT NULL, "summoner_name" character varying NOT NULL, "discord_name" character varying NOT NULL, "server" "user_details_server_enum" NOT NULL, "main_lane" "user_details_main_lane_enum" NOT NULL, "main_champions" "user_details_main_champions_enum" array NOT NULL, "league" "user_details_league_enum" NOT NULL, "last_update_details" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_ef1a1915f99bcf7a87049f7449" UNIQUE ("user_id"), CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD CONSTRAINT "FK_0053da5d6eb571f3ba05db1fb17" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "duo_statuses" ADD CONSTRAINT "FK_c08f1f494ac0b3e4d9fd40d72f7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "duo_statuses" ADD CONSTRAINT "FK_1d4ccbb240a7ab8d1b2416ae0ec" FOREIGN KEY ("desired_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matched_duos" ADD CONSTRAINT "FK_46ca626b84ef4df8fd763c172ce" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matched_duos" ADD CONSTRAINT "FK_3d23b9dbd6b4796f6ea45404c5a" FOREIGN KEY ("matched_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matching_spams" ADD CONSTRAINT "FK_981f7fb6ad71935dac28c6c51bf" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "superlike_payment" ADD CONSTRAINT "FK_ffff7f5700342a23cc704b6c9e3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_belongings" ADD CONSTRAINT "FK_b37513e87488b73781af038d13e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "FK_ef1a1915f99bcf7a87049f74494" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_ef1a1915f99bcf7a87049f74494"`);
        await queryRunner.query(`ALTER TABLE "user_belongings" DROP CONSTRAINT "FK_b37513e87488b73781af038d13e"`);
        await queryRunner.query(`ALTER TABLE "superlike_payment" DROP CONSTRAINT "FK_ffff7f5700342a23cc704b6c9e3"`);
        await queryRunner.query(`ALTER TABLE "matching_spams" DROP CONSTRAINT "FK_981f7fb6ad71935dac28c6c51bf"`);
        await queryRunner.query(`ALTER TABLE "matched_duos" DROP CONSTRAINT "FK_3d23b9dbd6b4796f6ea45404c5a"`);
        await queryRunner.query(`ALTER TABLE "matched_duos" DROP CONSTRAINT "FK_46ca626b84ef4df8fd763c172ce"`);
        await queryRunner.query(`ALTER TABLE "duo_statuses" DROP CONSTRAINT "FK_1d4ccbb240a7ab8d1b2416ae0ec"`);
        await queryRunner.query(`ALTER TABLE "duo_statuses" DROP CONSTRAINT "FK_c08f1f494ac0b3e4d9fd40d72f7"`);
        await queryRunner.query(`ALTER TABLE "contact_us" DROP CONSTRAINT "FK_0053da5d6eb571f3ba05db1fb17"`);
        await queryRunner.query(`DROP TABLE "user_details"`);
        await queryRunner.query(`DROP TABLE "user_belongings"`);
        await queryRunner.query(`DROP TABLE "superlike_payment"`);
        await queryRunner.query(`DROP TABLE "matching_spams"`);
        await queryRunner.query(`DROP TABLE "matched_duos"`);
        await queryRunner.query(`DROP TABLE "duo_statuses"`);
        await queryRunner.query(`DROP TABLE "contact_us"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
