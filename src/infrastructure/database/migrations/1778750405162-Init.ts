import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778750405162 implements MigrationInterface {
    name = 'Init1778750405162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "totalDataMeasurement" ("id" int NOT NULL IDENTITY(1,1), "value" decimal(10,3) NOT NULL, "timestamp" datetime NOT NULL CONSTRAINT "DF_13de08c38aed01d2ed5bd11a1ec" DEFAULT getdate(), "createdAt" datetime NOT NULL CONSTRAINT "DF_20470a2ba1b14677792eaa23e4c" DEFAULT getdate(), "meterId" int, CONSTRAINT "PK_6116e6bd47cc67acabfb439e338" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_TOTAL_DATA_MEASUREMENT" ON "totalDataMeasurement" ("id") `);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm³' FOR "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "totalDataMeasurement" ADD CONSTRAINT "FK_db14369a7e4410a0077a6341eab" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "totalDataMeasurement" DROP CONSTRAINT "FK_db14369a7e4410a0077a6341eab"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm3' FOR "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`DROP INDEX "PK_TOTAL_DATA_MEASUREMENT" ON "totalDataMeasurement"`);
        await queryRunner.query(`DROP TABLE "totalDataMeasurement"`);
    }

}
