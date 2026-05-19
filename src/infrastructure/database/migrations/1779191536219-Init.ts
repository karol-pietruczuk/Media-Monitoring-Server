import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779191536219 implements MigrationInterface {
    name = 'Init1779191536219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "pulseDataMultiplierValue"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "pulseDataMultiplierExpirationDateFrom"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "pulseDataExpirationDateUntil"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "pulseDataMultiplierCreatedAt"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "pulseDataMeterId"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "meterCalibrationStartId"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "meterCalibrationStopId"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP COLUMN "pulseDataChannelDataMappingInfo"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP COLUMN "pulseDataChannelMeterId"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP COLUMN "pulseDataChannelDataSourceId"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP COLUMN "pulseDataChannelCreatedAt"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "changedById" int`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "oldValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "newValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD "changedById" int`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD "oldValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD "newValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" DROP COLUMN "dataMappingInfo"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" ADD "dataMappingInfo" nvarchar(MAX) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "pulseDataMultiplierHistoryChange"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "pulseDataMultiplierHistoryChange" nvarchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP COLUMN "pulseDataChannelChange"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD "pulseDataChannelChange" nvarchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm³' FOR "meterUnit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm3' FOR "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP COLUMN "pulseDataChannelChange"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD "pulseDataChannelChange" nvarchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "pulseDataMultiplierHistoryChange"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "pulseDataMultiplierHistoryChange" nvarchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" DROP COLUMN "dataMappingInfo"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" ADD "dataMappingInfo" nvarchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP COLUMN "newValues"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP COLUMN "oldValues"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" DROP COLUMN "changedById"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "newValues"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "oldValues"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP COLUMN "changedById"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD "pulseDataChannelCreatedAt" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD "pulseDataChannelDataSourceId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD "pulseDataChannelMeterId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannelHistory" ADD "pulseDataChannelDataMappingInfo" nvarchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "meterCalibrationStopId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "meterCalibrationStartId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "pulseDataMeterId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "pulseDataMultiplierCreatedAt" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "pulseDataExpirationDateUntil" datetime2`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "pulseDataMultiplierExpirationDateFrom" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD "pulseDataMultiplierValue" numeric(15,10) NOT NULL`);
    }

}
