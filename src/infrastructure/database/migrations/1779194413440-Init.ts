import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779194413440 implements MigrationInterface {
    name = 'Init1779194413440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "meterName"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "meterSymbol"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "meterLocationId"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "meterCreatedAt"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" DROP COLUMN "meterCalibrationValue"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" DROP COLUMN "meterCalibrationTimestamp"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" DROP COLUMN "meterCalibrationCreatedAt"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" DROP COLUMN "meterCalibrationMeterId"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "changedById" int`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "oldValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "newValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" ADD "changedById" int`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" ADD "oldValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" ADD "newValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "meterChange"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "meterChange" nvarchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" DROP COLUMN "meterCalibrationChangeType"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" ADD "meterCalibrationChangeType" nvarchar(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" DROP COLUMN "meterCalibrationChangeType"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" ADD "meterCalibrationChangeType" nvarchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "meterChange"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "meterChange" nvarchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" DROP COLUMN "newValues"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" DROP COLUMN "oldValues"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" DROP COLUMN "changedById"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "newValues"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "oldValues"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP COLUMN "changedById"`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" ADD "meterCalibrationMeterId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" ADD "meterCalibrationCreatedAt" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" ADD "meterCalibrationTimestamp" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterCalibrationHistory" ADD "meterCalibrationValue" numeric(17,4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "meterCreatedAt" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "meterLocationId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "meterUnit" nvarchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm3' FOR "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "meterSymbol" nvarchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD "meterName" nvarchar(50) NOT NULL`);
    }

}
