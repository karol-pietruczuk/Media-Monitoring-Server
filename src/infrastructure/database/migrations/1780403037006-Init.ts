import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780403037006 implements MigrationInterface {
    name = 'Init1780403037006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meter" ADD "activeTotalData" bit NOT NULL CONSTRAINT "DF_9dbc584738ee5f4e205156507e5" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "meter" ADD "activePulseData" bit NOT NULL CONSTRAINT "DF_69ec27133b046db46d39972547c" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_69ec27133b046db46d39972547c"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP COLUMN "activePulseData"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_9dbc584738ee5f4e205156507e5"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP COLUMN "activeTotalData"`);
    }

}
