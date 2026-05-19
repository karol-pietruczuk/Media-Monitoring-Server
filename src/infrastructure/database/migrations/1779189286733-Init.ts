import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779189286733 implements MigrationInterface {
    name = 'Init1779189286733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "PK_Location_History" ON "location_history"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "dataSourceProtocol"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "dataSourceConnectionInfo"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "dataSourcCreatedAt"`);
        await queryRunner.query(`ALTER TABLE "dataSource" ADD "isActive" bit NOT NULL CONSTRAINT "DF_676628a351d88c39365d7f92889" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "changedById" int`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "oldValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "newValues" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_6620cd026ee2b231beac7cfe578"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 0 FOR "role"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm³' FOR "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "dataSourceChange"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "dataSourceChange" nvarchar(50) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_LOCATION_HISTORY" ON "location_history" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "PK_LOCATION_HISTORY" ON "location_history"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "dataSourceChange"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "dataSourceChange" nvarchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm3' FOR "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_6620cd026ee2b231beac7cfe578"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 'VIEWER' FOR "role"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "newValues"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "oldValues"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "changedById"`);
        await queryRunner.query(`ALTER TABLE "dataSource" DROP CONSTRAINT "DF_676628a351d88c39365d7f92889"`);
        await queryRunner.query(`ALTER TABLE "dataSource" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "dataSourcCreatedAt" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "dataSourceConnectionInfo" nvarchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "dataSourceProtocol" nvarchar(30) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_Location_History" ON "location_history" ("id") `);
    }

}
