import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779775081049 implements MigrationInterface {
    name = 'Init1779775081049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "hashedRefreshToken" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isLoggedIn" bit NOT NULL CONSTRAINT "DF_cbafaae2c66e3072ec1abd8a7ae" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" DROP CONSTRAINT "FK_98d09dc65eb3ef3853a32848537"`);
        await queryRunner.query(`ALTER TABLE "totalDataMeasurement" DROP CONSTRAINT "FK_db14369a7e4410a0077a6341eab"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" DROP CONSTRAINT "FK_8cb1a2ce30f84baf2c03f752111"`);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" DROP CONSTRAINT "FK_28b858c26cb941a699e658d57f1"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" DROP CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05"`);
        await queryRunner.query(`ALTER TABLE "meterCalibration" DROP CONSTRAINT "FK_f9fbc6fa83d8c62d61c8668b964"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" DROP CONSTRAINT "FK_b0c9b25f862a628225c1bb9d1e3"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "PK_6a2a722edc5f966fa3562638f91"`);
        await queryRunner.query(`DROP INDEX "PK_Meter" ON "meter"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD "id" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "PK_6a2a722edc5f966fa3562638f91" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³' FOR "unit"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_Meter" ON "meter" ("id") `);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" ADD CONSTRAINT "FK_28b858c26cb941a699e658d57f1" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" ADD CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meterCalibration" ADD CONSTRAINT "FK_f9fbc6fa83d8c62d61c8668b964" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" ADD CONSTRAINT "FK_b0c9b25f862a628225c1bb9d1e3" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" ADD CONSTRAINT "FK_8cb1a2ce30f84baf2c03f752111" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" ADD CONSTRAINT "FK_98d09dc65eb3ef3853a32848537" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "totalDataMeasurement" ADD CONSTRAINT "FK_db14369a7e4410a0077a6341eab" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "totalDataMeasurement" DROP CONSTRAINT "FK_db14369a7e4410a0077a6341eab"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" DROP CONSTRAINT "FK_98d09dc65eb3ef3853a32848537"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" DROP CONSTRAINT "FK_8cb1a2ce30f84baf2c03f752111"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" DROP CONSTRAINT "FK_b0c9b25f862a628225c1bb9d1e3"`);
        await queryRunner.query(`ALTER TABLE "meterCalibration" DROP CONSTRAINT "FK_f9fbc6fa83d8c62d61c8668b964"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" DROP CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05"`);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" DROP CONSTRAINT "FK_28b858c26cb941a699e658d57f1"`);
        await queryRunner.query(`DROP INDEX "PK_Meter" ON "meter"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm3' FOR "unit"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "PK_6a2a722edc5f966fa3562638f91"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "meter" ADD "id" int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_Meter" ON "meter" ("id") `);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "PK_6a2a722edc5f966fa3562638f91" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" ADD CONSTRAINT "FK_b0c9b25f862a628225c1bb9d1e3" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meterCalibration" ADD CONSTRAINT "FK_f9fbc6fa83d8c62d61c8668b964" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" ADD CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" ADD CONSTRAINT "FK_28b858c26cb941a699e658d57f1" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" ADD CONSTRAINT "FK_8cb1a2ce30f84baf2c03f752111" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "totalDataMeasurement" ADD CONSTRAINT "FK_db14369a7e4410a0077a6341eab" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" ADD CONSTRAINT "FK_98d09dc65eb3ef3853a32848537" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_cbafaae2c66e3072ec1abd8a7ae"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isLoggedIn"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hashedRefreshToken"`);
    }

}
