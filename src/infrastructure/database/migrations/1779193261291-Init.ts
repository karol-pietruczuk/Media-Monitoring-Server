import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779193261291 implements MigrationInterface {
    name = 'Init1779193261291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" DROP COLUMN "totalDataChannelDataMappingInfo"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" DROP COLUMN "totalDataChannelMeterId"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" DROP COLUMN "totalDataChannelDataSourceId"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" DROP COLUMN "totalDataChannelCreatedAt"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" ADD "changedById" int`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" ADD "oldValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" ADD "newValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" DROP COLUMN "dataMappingInfo"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" ADD "dataMappingInfo" nvarchar(MAX) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" DROP COLUMN "totalDataChannelChangeType"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" ADD "totalDataChannelChangeType" nvarchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm³' FOR "meterUnit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm3' FOR "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" DROP COLUMN "totalDataChannelChangeType"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" ADD "totalDataChannelChangeType" nvarchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" DROP COLUMN "dataMappingInfo"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" ADD "dataMappingInfo" nvarchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" DROP COLUMN "newValues"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" DROP COLUMN "oldValues"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" DROP COLUMN "changedById"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" ADD "totalDataChannelCreatedAt" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" ADD "totalDataChannelDataSourceId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" ADD "totalDataChannelMeterId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "totalDataChannelHistory" ADD "totalDataChannelDataMappingInfo" nvarchar(120) NOT NULL`);
    }

}
