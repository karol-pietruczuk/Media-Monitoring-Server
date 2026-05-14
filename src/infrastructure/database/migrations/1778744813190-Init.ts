import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778744813190 implements MigrationInterface {
    name = 'Init1778744813190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locationHistory" DROP COLUMN "mainLocation"`);
        await queryRunner.query(`ALTER TABLE "locationHistory" DROP COLUMN "subLocation"`);
        await queryRunner.query(`ALTER TABLE "locationHistory" ADD "locationMainLocation" nvarchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "locationHistory" ADD "locationSubLocation" nvarchar(50)`);
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
        await queryRunner.query(`ALTER TABLE "locationHistory" DROP COLUMN "locationSubLocation"`);
        await queryRunner.query(`ALTER TABLE "locationHistory" DROP COLUMN "locationMainLocation"`);
        await queryRunner.query(`ALTER TABLE "locationHistory" ADD "subLocation" nvarchar(50)`);
        await queryRunner.query(`ALTER TABLE "locationHistory" ADD "mainLocation" nvarchar(50) NOT NULL`);
    }

}
