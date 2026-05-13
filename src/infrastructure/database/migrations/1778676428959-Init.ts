import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778676428959 implements MigrationInterface {
    name = 'Init1778676428959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pulseDataCalculated" ("id" int NOT NULL IDENTITY(1,1), "pulsesAfterLastCalibration" bigint NOT NULL, "actualValue" numeric(17,4) NOT NULL, "actualTimestamp" datetime NOT NULL CONSTRAINT "DF_4fe9c6d8ed54e703203f96cefc6" DEFAULT getdate(), "meterId" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_aad5e30e89062936d58e7133f2e" DEFAULT getdate(), CONSTRAINT "UQ_28b858c26cb941a699e658d57f1" UNIQUE ("meterId"), CONSTRAINT "UQ_aad5e30e89062936d58e7133f2e" UNIQUE ("createdAt"), CONSTRAINT "PK_d1fea62499bddd5a8110366d6d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ__PULSE_DATA_CALCULATED_METER_ID" ON "pulseDataCalculated" ("meterId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_CALCULATED" ON "pulseDataCalculated" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_28b858c26cb941a699e658d57f" ON "pulseDataCalculated" ("meterId") WHERE "meterId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "meterCalibration" ("id" int NOT NULL IDENTITY(1,1), "value" numeric(17,4) NOT NULL, "useToCalculateMultiplier" nvarchar(30) NOT NULL, "timestamp" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_af6fd62a36bfa9e73fa215a7b66" DEFAULT getdate(), "meterId" int, CONSTRAINT "UQ_47bf84de15f951fbca8a59c534c" UNIQUE ("timestamp"), CONSTRAINT "PK_b172acc30b2f063dcae6d1ccc19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_METER_CALIBRATION" ON "meterCalibration" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataMultiplierHistory" ("id" int NOT NULL IDENTITY(1,1), "multiplier" numeric(15,10) NOT NULL, "expirationDateFrom" datetime NOT NULL, "expirationDateUntil" datetime, "createdAt" datetime NOT NULL CONSTRAINT "DF_8346f752c62174e2f1caa753bd7" DEFAULT getdate(), "multiplierHistoryChange" nvarchar(30) NOT NULL, "meterId" int, "multiplierId" int, CONSTRAINT "PK_15b4b1c36cb9f4204434d663ff0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_MULTIPLIER_HISTORY" ON "pulseDataMultiplierHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataMultiplier" ("id" int NOT NULL IDENTITY(1,1), "multiplier" numeric(15,10) NOT NULL, "expirationDateFrom" datetime NOT NULL, "expirationDateUntil" datetime, "createdAt" datetime NOT NULL CONSTRAINT "DF_a67d0766b0379616da572cf535d" DEFAULT getdate(), "meterId" int, CONSTRAINT "PK_f11d372a7474d153dd50e734411" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_MULTIPLIER" ON "pulseDataMultiplier" ("id") `);
        await queryRunner.query(`CREATE TABLE "location" ("id" int NOT NULL IDENTITY(1,1), "mainLocation" nvarchar(50) NOT NULL, "subLocation" nvarchar(50), "createdAt" datetime NOT NULL CONSTRAINT "DF_09dee1a3d42723079bd45577916" DEFAULT getdate(), CONSTRAINT "UQ_09dee1a3d42723079bd45577916" UNIQUE ("createdAt"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_LOCATION" ON "location" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataMeasurement" ("id" int NOT NULL IDENTITY(1,1), "meterPulses" int NOT NULL, "timestamp" datetime NOT NULL CONSTRAINT "DF_6b2276e47623e9b6f045f61890d" DEFAULT getdate(), "createdAt" datetime NOT NULL CONSTRAINT "DF_456bd2ea7b9e7b487edbbb69bf7" DEFAULT getdate(), "meterId" int, CONSTRAINT "UQ_6b2276e47623e9b6f045f61890d" UNIQUE ("timestamp"), CONSTRAINT "PK_0761eacb870e9339e4da72b97a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_PULSE_DATA_MEASUREMENT_TIMESTAMP" ON "pulseDataMeasurement" ("timestamp") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_MEASUREMENT" ON "pulseDataMeasurement" ("id") `);
        await queryRunner.query(`CREATE TABLE "dataSource" ("id" int NOT NULL IDENTITY(1,1), "protocol" nvarchar(30) NOT NULL, "connectionInfo" nvarchar(120) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_edf3f07a01e6cceb0a55b0d85e5" DEFAULT getdate(), CONSTRAINT "PK_6d01ae6c0f47baf4f8e37342268" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_DATA_SOURCE" ON "dataSource" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataChannel" ("id" int NOT NULL IDENTITY(1,1), "dataMappingInfo" nvarchar(120) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_f5290628149a0a84edac7932b97" DEFAULT getdate(), "meterId" int, "dataSourceId" int, CONSTRAINT "PK_b8a3f6bfe61f26586b43fed2e9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_CHANNEL" ON "pulseDataChannel" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_98d09dc65eb3ef3853a3284853" ON "pulseDataChannel" ("meterId") WHERE "meterId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "meter" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(50) NOT NULL, "symbol" nvarchar(50) NOT NULL, "unit" nvarchar(30) NOT NULL CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³', "createdAt" datetime NOT NULL CONSTRAINT "DF_27faa9c3b0db1ee219b04db21ca" DEFAULT getdate(), "locationId" int, CONSTRAINT "PK_6a2a722edc5f966fa3562638f91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_Meter" ON "meter" ("id") `);
        await queryRunner.query(`CREATE TABLE "totalDataChannel" ("id" int NOT NULL IDENTITY(1,1), "symbol" nvarchar(120) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_64d0ab131e112a937260b9327ea" DEFAULT getdate(), "meterId" int, "dataSourceId" int, CONSTRAINT "UQ_64d0ab131e112a937260b9327ea" UNIQUE ("createdAt"), CONSTRAINT "PK_766a741c75f32257736dbc49aac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_TOTAL_DATA_CHANNEL" ON "totalDataChannel" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_8cb1a2ce30f84baf2c03f75211" ON "totalDataChannel" ("meterId") WHERE "meterId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "pulseDataChannelHistory" ("id" int NOT NULL IDENTITY(1,1), "pulseDataChannelChange" nvarchar(30) NOT NULL, "pulseDataChannelId" int NOT NULL, "pulseDataChannelDataMappingInfo" nvarchar(120) NOT NULL, "pulseDataChannelMeterId" int NOT NULL, "pulseDataChannelDataSourceId" int NOT NULL, "pulseDataChannelCreatedAt" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_aa8e6dbf84521b0c32ccc2be5ea" DEFAULT getdate(), CONSTRAINT "PK_475a14ec5a8899661ac6068bbfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_CHANNEL_HISTORY" ON "pulseDataChannelHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "meterHistory" ("id" int NOT NULL IDENTITY(1,1), "meterChange" nvarchar(30) NOT NULL, "meterId" int NOT NULL, "meterName" nvarchar(50) NOT NULL, "meterSymbol" nvarchar(50) NOT NULL, "meterUnit" nvarchar(30) NOT NULL CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm³', "meterLocationId" int NOT NULL, "meterCreatedAt" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_d9324442b475ac6627bb5076155" DEFAULT getdate(), CONSTRAINT "PK_88b7d82ae75e9157cb3f9075118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_METER_HISTORY" ON "meterHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "dataSourceHistory" ("id" int NOT NULL IDENTITY(1,1), "dataSourceChange" nvarchar(30) NOT NULL, "dataSourceId" int NOT NULL, "dataSourceProtocol" nvarchar(30) NOT NULL, "dataSourceConnectionInfo" nvarchar(120) NOT NULL, "dataSourcCreatedAt" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_128fccbbcc4db880fa7faef6cea" DEFAULT getdate(), CONSTRAINT "PK_e64d4508fdfe050740dee68529e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_DATA_SOURCE_HISTORY" ON "dataSourceHistory" ("id") `);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" ADD CONSTRAINT "FK_28b858c26cb941a699e658d57f1" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meterCalibration" ADD CONSTRAINT "FK_f9fbc6fa83d8c62d61c8668b964" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD CONSTRAINT "FK_a61c939aa27feeb7cc20753fdb4" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" ADD CONSTRAINT "FK_7aa2931f5372e472895a1916acd" FOREIGN KEY ("multiplierId") REFERENCES "pulseDataMultiplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" ADD CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" ADD CONSTRAINT "FK_b0c9b25f862a628225c1bb9d1e3" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" ADD CONSTRAINT "FK_98d09dc65eb3ef3853a32848537" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" ADD CONSTRAINT "FK_ac1ab1c5949bf80cbf4752a0991" FOREIGN KEY ("dataSourceId") REFERENCES "dataSource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meter" ADD CONSTRAINT "FK_9136c9541ac9d19a9ec7eead8e4" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" ADD CONSTRAINT "FK_8cb1a2ce30f84baf2c03f752111" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" ADD CONSTRAINT "FK_2ee405d48aea20d524cccc3c797" FOREIGN KEY ("dataSourceId") REFERENCES "dataSource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "totalDataChannel" DROP CONSTRAINT "FK_2ee405d48aea20d524cccc3c797"`);
        await queryRunner.query(`ALTER TABLE "totalDataChannel" DROP CONSTRAINT "FK_8cb1a2ce30f84baf2c03f752111"`);
        await queryRunner.query(`ALTER TABLE "meter" DROP CONSTRAINT "FK_9136c9541ac9d19a9ec7eead8e4"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" DROP CONSTRAINT "FK_ac1ab1c5949bf80cbf4752a0991"`);
        await queryRunner.query(`ALTER TABLE "pulseDataChannel" DROP CONSTRAINT "FK_98d09dc65eb3ef3853a32848537"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMeasurement" DROP CONSTRAINT "FK_b0c9b25f862a628225c1bb9d1e3"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" DROP CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP CONSTRAINT "FK_7aa2931f5372e472895a1916acd"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplierHistory" DROP CONSTRAINT "FK_a61c939aa27feeb7cc20753fdb4"`);
        await queryRunner.query(`ALTER TABLE "meterCalibration" DROP CONSTRAINT "FK_f9fbc6fa83d8c62d61c8668b964"`);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" DROP CONSTRAINT "FK_28b858c26cb941a699e658d57f1"`);
        await queryRunner.query(`DROP INDEX "PK_DATA_SOURCE_HISTORY" ON "dataSourceHistory"`);
        await queryRunner.query(`DROP TABLE "dataSourceHistory"`);
        await queryRunner.query(`DROP INDEX "PK_METER_HISTORY" ON "meterHistory"`);
        await queryRunner.query(`DROP TABLE "meterHistory"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_CHANNEL_HISTORY" ON "pulseDataChannelHistory"`);
        await queryRunner.query(`DROP TABLE "pulseDataChannelHistory"`);
        await queryRunner.query(`DROP INDEX "REL_8cb1a2ce30f84baf2c03f75211" ON "totalDataChannel"`);
        await queryRunner.query(`DROP INDEX "PK_TOTAL_DATA_CHANNEL" ON "totalDataChannel"`);
        await queryRunner.query(`DROP TABLE "totalDataChannel"`);
        await queryRunner.query(`DROP INDEX "PK_Meter" ON "meter"`);
        await queryRunner.query(`DROP TABLE "meter"`);
        await queryRunner.query(`DROP INDEX "REL_98d09dc65eb3ef3853a3284853" ON "pulseDataChannel"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_CHANNEL" ON "pulseDataChannel"`);
        await queryRunner.query(`DROP TABLE "pulseDataChannel"`);
        await queryRunner.query(`DROP INDEX "PK_DATA_SOURCE" ON "dataSource"`);
        await queryRunner.query(`DROP TABLE "dataSource"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_MEASUREMENT" ON "pulseDataMeasurement"`);
        await queryRunner.query(`DROP INDEX "UQ_PULSE_DATA_MEASUREMENT_TIMESTAMP" ON "pulseDataMeasurement"`);
        await queryRunner.query(`DROP TABLE "pulseDataMeasurement"`);
        await queryRunner.query(`DROP INDEX "PK_LOCATION" ON "location"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_MULTIPLIER" ON "pulseDataMultiplier"`);
        await queryRunner.query(`DROP TABLE "pulseDataMultiplier"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_MULTIPLIER_HISTORY" ON "pulseDataMultiplierHistory"`);
        await queryRunner.query(`DROP TABLE "pulseDataMultiplierHistory"`);
        await queryRunner.query(`DROP INDEX "PK_METER_CALIBRATION" ON "meterCalibration"`);
        await queryRunner.query(`DROP TABLE "meterCalibration"`);
        await queryRunner.query(`DROP INDEX "REL_28b858c26cb941a699e658d57f" ON "pulseDataCalculated"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_CALCULATED" ON "pulseDataCalculated"`);
        await queryRunner.query(`DROP INDEX "UQ__PULSE_DATA_CALCULATED_METER_ID" ON "pulseDataCalculated"`);
        await queryRunner.query(`DROP TABLE "pulseDataCalculated"`);
    }

}
