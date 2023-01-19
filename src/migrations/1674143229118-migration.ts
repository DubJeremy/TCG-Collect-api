import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1674143229118 implements MigrationInterface {
    name = 'migration1674143229118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wanted" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_611eb74d59ad383ba7bd899bb9" UNIQUE ("userId"), CONSTRAINT "PK_f95ffdcbd385c61a73504a5d4ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "collectionId" integer, "wantedId" integer, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_a330cb77418f680c58db2b127c" UNIQUE ("collectionId"), CONSTRAINT "REL_049937e52fadb01b44cf8dbd3d" UNIQUE ("wantedId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_ca25eb01f75a85272300f33602" UNIQUE ("userId"), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection_cards" ("id" SERIAL NOT NULL, "favorite" boolean NOT NULL DEFAULT false, "to_exchange" boolean NOT NULL DEFAULT false, "collectionId" integer, "cardId" integer, CONSTRAINT "PK_543a8393c7b5f1783fc8b112bf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "cardTCGdex" character varying NOT NULL, CONSTRAINT "UQ_b697b560ac7da60101dad47f585" UNIQUE ("cardTCGdex"), CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wanted_cards_card" ("wantedId" integer NOT NULL, "cardId" integer NOT NULL, CONSTRAINT "PK_2319dadd6fe89f836782a44f027" PRIMARY KEY ("wantedId", "cardId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3167385d67a9013333dfae428c" ON "wanted_cards_card" ("wantedId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0dfbfb165c191aa9c734eb4d6f" ON "wanted_cards_card" ("cardId") `);
        await queryRunner.query(`ALTER TABLE "wanted" ADD CONSTRAINT "FK_611eb74d59ad383ba7bd899bb91" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a330cb77418f680c58db2b127c5" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_049937e52fadb01b44cf8dbd3da" FOREIGN KEY ("wantedId") REFERENCES "wanted"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_ca25eb01f75a85272300f336029" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_cards" ADD CONSTRAINT "FK_f7aca79fa27492e9050bbbd16b7" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_cards" ADD CONSTRAINT "FK_e09a179028403ad3ef9fdeeb934" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wanted_cards_card" ADD CONSTRAINT "FK_3167385d67a9013333dfae428c3" FOREIGN KEY ("wantedId") REFERENCES "wanted"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "wanted_cards_card" ADD CONSTRAINT "FK_0dfbfb165c191aa9c734eb4d6ff" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wanted_cards_card" DROP CONSTRAINT "FK_0dfbfb165c191aa9c734eb4d6ff"`);
        await queryRunner.query(`ALTER TABLE "wanted_cards_card" DROP CONSTRAINT "FK_3167385d67a9013333dfae428c3"`);
        await queryRunner.query(`ALTER TABLE "collection_cards" DROP CONSTRAINT "FK_e09a179028403ad3ef9fdeeb934"`);
        await queryRunner.query(`ALTER TABLE "collection_cards" DROP CONSTRAINT "FK_f7aca79fa27492e9050bbbd16b7"`);
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_ca25eb01f75a85272300f336029"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_049937e52fadb01b44cf8dbd3da"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a330cb77418f680c58db2b127c5"`);
        await queryRunner.query(`ALTER TABLE "wanted" DROP CONSTRAINT "FK_611eb74d59ad383ba7bd899bb91"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0dfbfb165c191aa9c734eb4d6f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3167385d67a9013333dfae428c"`);
        await queryRunner.query(`DROP TABLE "wanted_cards_card"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "collection_cards"`);
        await queryRunner.query(`DROP TABLE "collection"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "wanted"`);
    }

}
