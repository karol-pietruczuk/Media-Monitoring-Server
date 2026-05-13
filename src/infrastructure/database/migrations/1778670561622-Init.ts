import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778670561622 implements MigrationInterface {
    name = 'Init1778670561622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "pulseDataChannelId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" ADD "totalDataChannelId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_576e9414869f9ff8c0b1004c8e8"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_576e9414869f9ff8c0b1004c8e8" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "DF_576e9414869f9ff8c0b1004c8e8"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "DF_576e9414869f9ff8c0b1004c8e8" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "totalDataChannelId"`);
        await queryRunner.query(`ALTER TABLE "dataSourceHistory" DROP COLUMN "pulseDataChannelId"`);
    }

}
