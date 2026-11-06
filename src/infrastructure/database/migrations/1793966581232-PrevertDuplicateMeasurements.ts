import { MigrationInterface, QueryRunner } from "typeorm";

export class PrevertDuplicateMeasurements1793966581232 implements MigrationInterface {
    name = 'PrevertDuplicateMeasurements1793966581232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IX_PULSE_DATA_MEASUREMENT" ON "pulseDataMeasurement"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_PULSE_DATA_MEASUREMENT" ON "pulseDataMeasurement" ("timestamp", "meterId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IX_PULSE_DATA_MEASUREMENT" ON "pulseDataMeasurement"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`CREATE INDEX "IX_PULSE_DATA_MEASUREMENT" ON "pulseDataMeasurement" ("timestamp", "meterId") `);
    }

}
