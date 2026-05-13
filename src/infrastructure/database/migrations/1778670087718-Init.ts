import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778670087718 implements MigrationInterface {
    name = 'Init1778670087718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pulseDataChannelHistory" ("id" int NOT NULL IDENTITY(1,1), "symbol" nvarchar(120) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_aa8e6dbf84521b0c32ccc2be5ea" DEFAULT getdate(), "pulseDataChannelHistoryChange" nvarchar(30) NOT NULL, "meterId" int NOT NULL, "dataSourceId" int NOT NULL, "pulseDataChannelId" int, CONSTRAINT "UQ_aa8e6dbf84521b0c32ccc2be5ea" UNIQUE ("createdAt"), CONSTRAINT "PK_475a14ec5a8899661ac6068bbfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_CHANNEL_HISTORY" ON "pulseDataChannelHistory" ("id") `);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_576e9414869f9ff8c0b1004c8e8"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_576e9414869f9ff8c0b1004c8e8" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD CONSTRAINT "FK_7981b1f3deceb4668376048e330" FOREIGN KEY ("pulseDataChannelId") REFERENCES "pulseDataChannel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP CONSTRAINT "FK_7981b1f3deceb4668376048e330"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_576e9414869f9ff8c0b1004c8e8"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_576e9414869f9ff8c0b1004c8e8" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_CHANNEL_HISTORY" ON "pulseDataChannelHistory"`);
        await queryRunner.query(`DROP TABLE "pulseDataChannelHistory"`);
    }

}
