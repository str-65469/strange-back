"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641401444310 = void 0;
class Main1641401444310 {
    constructor() {
        this.name = 'Main1641401444310';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "chat_participants" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "chat_last_deleted_at" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, "chatHeadId" integer, CONSTRAINT "PK_ebf68c52a2b4dceb777672b782d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "chat_messages_message_type_enum" AS ENUM()`);
        await queryRunner.query(`CREATE TABLE "chat_messages" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "text_message" text NOT NULL, "img_url" character varying NOT NULL, "voice_url" character varying NOT NULL, "video_url" character varying NOT NULL, "gif_url" character varying NOT NULL, "message_type" "chat_messages_message_type_enum" NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "userId" integer, "chatHeadId" integer, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_heads" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "is_one_to_one" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_4acfc211cdc3054f42ec30066c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_fb6add83b1a7acc94433d385692" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_c8321b7927d96a0e65102a2e65a" FOREIGN KEY ("chatHeadId") REFERENCES "chat_heads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_43d968962b9e24e1e3517c0fbff" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_3db48714f459d882292d9524ef1" FOREIGN KEY ("chatHeadId") REFERENCES "chat_heads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_3db48714f459d882292d9524ef1"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_43d968962b9e24e1e3517c0fbff"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_c8321b7927d96a0e65102a2e65a"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_fb6add83b1a7acc94433d385692"`);
        await queryRunner.query(`DROP TABLE "chat_heads"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
        await queryRunner.query(`DROP TYPE "chat_messages_message_type_enum"`);
        await queryRunner.query(`DROP TABLE "chat_participants"`);
    }
}
exports.Main1641401444310 = Main1641401444310;
//# sourceMappingURL=1641401444310-Main.js.map