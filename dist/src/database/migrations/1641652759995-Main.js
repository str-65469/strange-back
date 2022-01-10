"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main1641652759995 = void 0;
class Main1641652759995 {
    constructor() {
        this.name = 'Main1641652759995';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "chat_messages" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "text_message" text, "img_url" character varying, "voice_url" character varying, "video_url" character varying, "gif_url" character varying, "message_type" "chat_messages_message_type_enum" NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "userId" integer, "chatHeadId" integer, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_43d968962b9e24e1e3517c0fbff" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_3db48714f459d882292d9524ef1" FOREIGN KEY ("chatHeadId") REFERENCES "chat_heads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_3db48714f459d882292d9524ef1"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_43d968962b9e24e1e3517c0fbff"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
    }
}
exports.Main1641652759995 = Main1641652759995;
//# sourceMappingURL=1641652759995-Main.js.map