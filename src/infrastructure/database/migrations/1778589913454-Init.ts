import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778589913454 implements MigrationInterface {
    name = 'Init1778589913454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pulseDataCalculated" ("id" int NOT NULL IDENTITY(1,1), "pulsesAfterLastCalibration" bigint NOT NULL, "actualValue" numeric(17,4) NOT NULL, "actualTimestamp" datetime NOT NULL CONSTRAINT "DF_4fe9c6d8ed54e703203f96cefc6" DEFAULT getdate(), "meterId" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_aad5e30e89062936d58e7133f2e" DEFAULT getdate(), CONSTRAINT "UQ_28b858c26cb941a699e658d57f1" UNIQUE ("meterId"), CONSTRAINT "UQ_aad5e30e89062936d58e7133f2e" UNIQUE ("createdAt"), CONSTRAINT "PK_d1fea62499bddd5a8110366d6d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ__PULSE_DATA_CALCULATED_METER_ID" ON "pulseDataCalculated" ("meterId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_CALCULATED" ON "pulseDataCalculated" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_28b858c26cb941a699e658d57f" ON "pulseDataCalculated" ("meterId") WHERE "meterId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "calibration" ("id" int NOT NULL IDENTITY(1,1), "value" numeric(17,4) NOT NULL, "timestamp" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_4ffbac6c4862d4234ce835257cf" DEFAULT getdate(), "meterId" int, CONSTRAINT "UQ_e316d3046becf218af366cb7cc6" UNIQUE ("timestamp"), CONSTRAINT "PK_f8252d02ac0708df73275ef24a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_CALIBRATION" ON "calibration" ("id") `);
        await queryRunner.query(`CREATE TABLE "location" ("id" int NOT NULL IDENTITY(1,1), "mainLocation" nvarchar(50) NOT NULL, "subLocation" nvarchar(50), "createdAt" datetime NOT NULL CONSTRAINT "DF_09dee1a3d42723079bd45577916" DEFAULT getdate(), CONSTRAINT "UQ_09dee1a3d42723079bd45577916" UNIQUE ("createdAt"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_LOCATION" ON "location" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataMeasurement" ("id" int NOT NULL IDENTITY(1,1), "meterPulses" int NOT NULL, "timestamp" datetime NOT NULL CONSTRAINT "DF_6b2276e47623e9b6f045f61890d" DEFAULT getdate(), "createdAt" datetime NOT NULL CONSTRAINT "DF_456bd2ea7b9e7b487edbbb69bf7" DEFAULT getdate(), "meterId" int, CONSTRAINT "UQ_6b2276e47623e9b6f045f61890d" UNIQUE ("timestamp"), CONSTRAINT "UQ_456bd2ea7b9e7b487edbbb69bf7" UNIQUE ("createdAt"), CONSTRAINT "PK_0761eacb870e9339e4da72b97a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_MEDIA_PULSE_DATA_MEASUREMENT_TIMESTAMP" ON "pulseDataMeasurement" ("timestamp") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_MEDIA_PULSE_DATA_MEASUREMENT" ON "pulseDataMeasurement" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataMultiplierHistory" ("id" int NOT NULL IDENTITY(1,1), "multiplier" numeric(15,10) NOT NULL, "expirationDateFrom" datetime NOT NULL, "expirationDateUntil" datetime, "createdAt" datetime NOT NULL CONSTRAINT "DF_8346f752c62174e2f1caa753bd7" DEFAULT getdate(), "multiplierHistoryChange" nvarchar(30) NOT NULL, "meterId" int, "multiplierId" int, CONSTRAINT "PK_15b4b1c36cb9f4204434d663ff0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_MULTIPLIER_HISTORY" ON "pulseDataMultiplierHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "meterHistory" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(50) NOT NULL, "symbol" nvarchar(50) NOT NULL, "unit" nvarchar(30) CONSTRAINT CHK_594dec4cda7c5e2b9dcdd6a80c_ENUM CHECK(unit IN ('l','m³')) NOT NULL CONSTRAINT "DF_576e9414869f9ff8c0b1004c8e8" DEFAULT 'm³', "createdAt" datetime NOT NULL CONSTRAINT "DF_d9324442b475ac6627bb5076155" DEFAULT getdate(), "meterHistoryChange" nvarchar(30) NOT NULL, "locationId" int, "meterId" int, CONSTRAINT "PK_88b7d82ae75e9157cb3f9075118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_METER_HISTORY" ON "meterHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "meter" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(50) NOT NULL, "symbol" nvarchar(50) NOT NULL, "unit" nvarchar(30) CONSTRAINT CHK_d111ca4783eb2e23f2091f5bdb_ENUM CHECK(unit IN ('l','m³')) NOT NULL CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³', "createdAt" datetime NOT NULL CONSTRAINT "DF_27faa9c3b0db1ee219b04db21ca" DEFAULT getdate(), "locationId" int, CONSTRAINT "PK_6a2a722edc5f966fa3562638f91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_Meter" ON "meter" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataMultiplier" ("id" int NOT NULL IDENTITY(1,1), "multiplier" numeric(15,10) NOT NULL, "expirationDateFrom" datetime NOT NULL, "expirationDateUntil" datetime, "createdAt" datetime NOT NULL CONSTRAINT "DF_a67d0766b0379616da572cf535d" DEFAULT getdate(), "meterId" int, CONSTRAINT "PK_f11d372a7474d153dd50e734411" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_MULTIPLIER" ON "pulseDataMultiplier" ("id") `);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" ADD CONSTRAINT "FK_28b858c26cb941a699e658d57f1" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calibration" ADD CONSTRAINT "FK_5839d741ef8e54b860d68a52d88" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" ADD CONSTRAINT "FK_b0c9b25f862a628225c1bb9d1e3" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD CONSTRAINT "FK_a61c939aa27feeb7cc20753fdb4" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD CONSTRAINT "FK_7aa2931f5372e472895a1916acd" FOREIGN KEY ("multiplierId") REFERENCES "pulseDataMultiplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "FK_3d5aad5ae112dad6623ba2c0d9b" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meterHistory" ADD CONSTRAINT "FK_f1199ddf1fec3e30a5391c35e11" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "FK_9136c9541ac9d19a9ec7eead8e4" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" ADD CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" DROP CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "FK_9136c9541ac9d19a9ec7eead8e4"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "FK_f1199ddf1fec3e30a5391c35e11"`);
        await queryRunner.query(`ALTER TABLE "meterHistory" DROP CONSTRAINT "FK_3d5aad5ae112dad6623ba2c0d9b"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP CONSTRAINT "FK_7aa2931f5372e472895a1916acd"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP CONSTRAINT "FK_a61c939aa27feeb7cc20753fdb4"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" DROP CONSTRAINT "FK_b0c9b25f862a628225c1bb9d1e3"`);
        await queryRunner.query(`ALTER TABLE "calibration" DROP CONSTRAINT "FK_5839d741ef8e54b860d68a52d88"`);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" DROP CONSTRAINT "FK_28b858c26cb941a699e658d57f1"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_MULTIPLIER" ON "pulseDataMultiplier"`);
        await queryRunner.query(`DROP TABLE "pulseDataMultiplier"`);
        await queryRunner.query(`DROP INDEX "PK_Meter" ON "meter"`);
        await queryRunner.query(`DROP TABLE "meter"`);
        await queryRunner.query(`DROP INDEX "PK_METER_HISTORY" ON "meterHistory"`);
        await queryRunner.query(`DROP TABLE "meterHistory"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_MULTIPLIER_HISTORY" ON "pulseDataMultiplierHistory"`);
        await queryRunner.query(`DROP TABLE "pulseDataMultiplierHistory"`);
        await queryRunner.query(`DROP INDEX "PK_MEDIA_PULSE_DATA_MEASUREMENT" ON "pulseDataMeasurement"`);
        await queryRunner.query(`DROP INDEX "UQ_MEDIA_PULSE_DATA_MEASUREMENT_TIMESTAMP" ON "pulseDataMeasurement"`);
        await queryRunner.query(`DROP TABLE "pulseDataMeasurement"`);
        await queryRunner.query(`DROP INDEX "PK_LOCATION" ON "location"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP INDEX "PK_CALIBRATION" ON "calibration"`);
        await queryRunner.query(`DROP TABLE "calibration"`);
        await queryRunner.query(`DROP INDEX "REL_28b858c26cb941a699e658d57f" ON "pulseDataCalculated"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_CALCULATED" ON "pulseDataCalculated"`);
        await queryRunner.query(`DROP INDEX "UQ__PULSE_DATA_CALCULATED_METER_ID" ON "pulseDataCalculated"`);
        await queryRunner.query(`DROP TABLE "pulseDataCalculated"`);
    }

}
