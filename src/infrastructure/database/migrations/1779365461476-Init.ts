import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779365461476 implements MigrationInterface {
    name = 'Init1779365461476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_80ca6e6ef65fb9ef34ea8c90f42"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_80ca6e6ef65fb9ef34ea8c90f42" DEFAULT getdate() FOR "updatedAt"`);
    }

}
