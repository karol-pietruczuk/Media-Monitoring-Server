import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779100347475 implements MigrationInterface {
    name = 'Init1779100347475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location_history" ("id" int NOT NULL IDENTITY(1,1), "locationId" int NOT NULL, "changedById" int, "action" nvarchar(50) NOT NULL, "oldValues" nvarchar(MAX), "newValues" nvarchar(MAX), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_ceda584ec294c0ca7d56e5ff77d" DEFAULT getdate(), CONSTRAINT "PK_969935adbd171d824b649bc03d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_Location_History" ON "location_history" ("id") `);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm³' FOR "meterUnit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_da5140a8f09f52869894b49484e"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm3' FOR "meterUnit"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`DROP INDEX "PK_Location_History" ON "location_history"`);
        await queryRunner.query(`DROP TABLE "location_history"`);
    }

}
