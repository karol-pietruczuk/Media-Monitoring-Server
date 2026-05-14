import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778738972330 implements MigrationInterface {
    name = 'Init1778738972330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "UQ_PULSE_DATA_MEASUREMENT_TIMESTAMP" ON "pulseDataMeasurement"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" DROP COLUMN "meterPulses"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" DROP COLUMN "symbol"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" ADD "pulses" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" ADD "dataMappingInfo" nvarchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" DROP CONSTRAINT "UQ_6b2276e47623e9b6f045f61890d"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" DROP CONSTRAINT "UQ_64d0ab131e112a937260b9327ea"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm³' FOR "meterUnit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm3' FOR "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" ADD CONSTRAINT "UQ_64d0ab131e112a937260b9327ea" UNIQUE ("createdAt")`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" ADD CONSTRAINT "UQ_6b2276e47623e9b6f045f61890d" UNIQUE ("timestamp")`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" DROP COLUMN "dataMappingInfo"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" DROP COLUMN "pulses"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" ADD "symbol" nvarchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" ADD "meterPulses" int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_PULSE_DATA_MEASUREMENT_TIMESTAMP" ON "pulseDataMeasurement" ("timestamp") `);
    }

}
