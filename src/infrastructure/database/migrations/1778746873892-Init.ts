import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778746873892 implements MigrationInterface {
    name = 'Init1778746873892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "totalDataChannelHistory" ("id" int NOT NULL IDENTITY(1,1), "totalDataChannelChangeType" nvarchar(30) NOT NULL, "totalDataChannelId" int NOT NULL, "totalDataChannelDataMappingInfo" nvarchar(120) NOT NULL, "totalDataChannelMeterId" int NOT NULL, "totalDataChannelDataSourceId" int NOT NULL, "totalDataChannelCreatedAt" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_6d62ae5d4a5b4158342b5b6c472" DEFAULT getdate(), CONSTRAINT "PK_1827bd045643dd05e885b49329a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_TOTAL_DATA_CHANNEL_HISTORY" ON "totalDataChannelHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataCalculated" ("id" int NOT NULL IDENTITY(1,1), "pulsesAfterLastCalibration" bigint NOT NULL, "actualValue" numeric(17,4) NOT NULL, "actualTimestamp" datetime NOT NULL CONSTRAINT "DF_4fe9c6d8ed54e703203f96cefc6" DEFAULT getdate(), "meterId" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_aad5e30e89062936d58e7133f2e" DEFAULT getdate(), CONSTRAINT "UQ_28b858c26cb941a699e658d57f1" UNIQUE ("meterId"), CONSTRAINT "PK_d1fea62499bddd5a8110366d6d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ__PULSE_DATA_CALCULATED_METER_ID" ON "pulseDataCalculated" ("meterId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_CALCULATED" ON "pulseDataCalculated" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_28b858c26cb941a699e658d57f" ON "pulseDataCalculated" ("meterId") WHERE "meterId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "pulseDataMultiplier" ("id" int NOT NULL IDENTITY(1,1), "value" numeric(15,10) NOT NULL, "expirationDateFrom" datetime NOT NULL, "expirationDateUntil" datetime, "createdAt" datetime NOT NULL CONSTRAINT "DF_a67d0766b0379616da572cf535d" DEFAULT getdate(), "meterId" int, "meterCalibrationStart" int, "meterCalibrationStop" int, CONSTRAINT "PK_f11d372a7474d153dd50e734411" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_MULTIPLIER" ON "pulseDataMultiplier" ("id") `);
        await queryRunner.query(`CREATE TABLE "meterCalibration" ("id" int NOT NULL IDENTITY(1,1), "value" numeric(17,4) NOT NULL, "timestamp" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_af6fd62a36bfa9e73fa215a7b66" DEFAULT getdate(), "meterId" int, CONSTRAINT "PK_b172acc30b2f063dcae6d1ccc19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_METER_CALIBRATION" ON "meterCalibration" ("id") `);
        await queryRunner.query(`CREATE TABLE "location" ("id" int NOT NULL IDENTITY(1,1), "mainLocation" nvarchar(50) NOT NULL, "subLocation" nvarchar(50), "createdAt" datetime NOT NULL CONSTRAINT "DF_09dee1a3d42723079bd45577916" DEFAULT getdate(), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_LOCATION" ON "location" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataMeasurement" ("id" int NOT NULL IDENTITY(1,1), "pulses" int NOT NULL, "timestamp" datetime NOT NULL CONSTRAINT "DF_6b2276e47623e9b6f045f61890d" DEFAULT getdate(), "createdAt" datetime NOT NULL CONSTRAINT "DF_456bd2ea7b9e7b487edbbb69bf7" DEFAULT getdate(), "meterId" int, CONSTRAINT "PK_0761eacb870e9339e4da72b97a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_MEASUREMENT" ON "pulseDataMeasurement" ("id") `);
        await queryRunner.query(`CREATE TABLE "dataSource" ("id" int NOT NULL IDENTITY(1,1), "protocol" nvarchar(30) NOT NULL, "connectionInfo" nvarchar(120) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_edf3f07a01e6cceb0a55b0d85e5" DEFAULT getdate(), CONSTRAINT "PK_6d01ae6c0f47baf4f8e37342268" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_DATA_SOURCE" ON "dataSource" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataChannel" ("id" int NOT NULL IDENTITY(1,1), "dataMappingInfo" nvarchar(120) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_f5290628149a0a84edac7932b97" DEFAULT getdate(), "meterId" int, "dataSourceId" int, CONSTRAINT "PK_b8a3f6bfe61f26586b43fed2e9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_CHANNEL" ON "pulseDataChannel" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_98d09dc65eb3ef3853a3284853" ON "pulseDataChannel" ("meterId") WHERE "meterId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "meter" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(50) NOT NULL, "symbol" nvarchar(50) NOT NULL, "unit" nvarchar(30) NOT NULL CONSTRAINT "DF_bb7d584d202e6a15b269bdffcc9" DEFAULT 'm³', "createdAt" datetime NOT NULL CONSTRAINT "DF_27faa9c3b0db1ee219b04db21ca" DEFAULT getdate(), "locationId" int, CONSTRAINT "PK_6a2a722edc5f966fa3562638f91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_Meter" ON "meter" ("id") `);
        await queryRunner.query(`CREATE TABLE "totalDataChannel" ("id" int NOT NULL IDENTITY(1,1), "dataMappingInfo" nvarchar(120) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_64d0ab131e112a937260b9327ea" DEFAULT getdate(), "meterId" int, "dataSourceId" int, CONSTRAINT "PK_766a741c75f32257736dbc49aac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_TOTAL_DATA_CHANNEL" ON "totalDataChannel" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_8cb1a2ce30f84baf2c03f75211" ON "totalDataChannel" ("meterId") WHERE "meterId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "pulseDataMultiplierHistory" ("id" int NOT NULL IDENTITY(1,1), "pulseDataMultiplierHistoryChange" nvarchar(30) NOT NULL, "pulseDataMultiplierId" int NOT NULL, "pulseDataMultiplierValue" numeric(15,10) NOT NULL, "pulseDataMultiplierExpirationDateFrom" datetime NOT NULL, "pulseDataExpirationDateUntil" datetime, "pulseDataMultiplierCreatedAt" datetime NOT NULL, "pulseDataMeterId" int NOT NULL, "meterCalibrationStartId" int NOT NULL, "meterCalibrationStopId" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_8346f752c62174e2f1caa753bd7" DEFAULT getdate(), CONSTRAINT "PK_15b4b1c36cb9f4204434d663ff0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_MULTIPLIER_HISTORY" ON "pulseDataMultiplierHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "pulseDataChannelHistory" ("id" int NOT NULL IDENTITY(1,1), "pulseDataChannelChange" nvarchar(30) NOT NULL, "pulseDataChannelId" int NOT NULL, "pulseDataChannelDataMappingInfo" nvarchar(120) NOT NULL, "pulseDataChannelMeterId" int NOT NULL, "pulseDataChannelDataSourceId" int NOT NULL, "pulseDataChannelCreatedAt" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_aa8e6dbf84521b0c32ccc2be5ea" DEFAULT getdate(), CONSTRAINT "PK_475a14ec5a8899661ac6068bbfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_PULSE_DATA_CHANNEL_HISTORY" ON "pulseDataChannelHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "meterHistory" ("id" int NOT NULL IDENTITY(1,1), "meterChange" nvarchar(30) NOT NULL, "meterId" int NOT NULL, "meterName" nvarchar(50) NOT NULL, "meterSymbol" nvarchar(50) NOT NULL, "meterUnit" nvarchar(30) NOT NULL CONSTRAINT "DF_da5140a8f09f52869894b49484e" DEFAULT 'm³', "meterLocationId" int NOT NULL, "meterCreatedAt" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_d9324442b475ac6627bb5076155" DEFAULT getdate(), CONSTRAINT "PK_88b7d82ae75e9157cb3f9075118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_METER_HISTORY" ON "meterHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "meterCalibrationHistory" ("id" int NOT NULL IDENTITY(1,1), "meterCalibrationChangeType" nvarchar(30) NOT NULL, "meterCalibrationId" int NOT NULL, "meterCalibrationValue" numeric(17,4) NOT NULL, "meterCalibrationTimestamp" datetime NOT NULL, "meterCalibrationCreatedAt" datetime NOT NULL, "meterCalibrationMeterId" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_c1a08da5722b2b997f9ac725303" DEFAULT getdate(), CONSTRAINT "PK_de6ff7332d05e2c7d38e617110b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_METER_CALIBRATION_HISTORY" ON "meterCalibrationHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "locationHistory" ("id" int NOT NULL IDENTITY(1,1), "locationChangetype" nvarchar(30) NOT NULL, "locationId" int NOT NULL, "locationMainLocation" nvarchar(50) NOT NULL, "locationSubLocation" nvarchar(50), "locationCreatedAt" datetime NOT NULL CONSTRAINT "DF_d02919878dc6d918873ebfb8015" DEFAULT getdate(), "createdAt" datetime NOT NULL CONSTRAINT "DF_8f10335260da4ffa04991aa1b8c" DEFAULT getdate(), CONSTRAINT "PK_9fffd988706234e62982d9385c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_LOCATION_HISTORY" ON "locationHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "dataSourceHistory" ("id" int NOT NULL IDENTITY(1,1), "dataSourceChange" nvarchar(30) NOT NULL, "dataSourceId" int NOT NULL, "dataSourceProtocol" nvarchar(30) NOT NULL, "dataSourceConnectionInfo" nvarchar(120) NOT NULL, "dataSourcCreatedAt" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_128fccbbcc4db880fa7faef6cea" DEFAULT getdate(), CONSTRAINT "PK_e64d4508fdfe050740dee68529e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_DATA_SOURCE_HISTORY" ON "dataSourceHistory" ("id") `);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" ADD CONSTRAINT "FK_28b858c26cb941a699e658d57f1" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" ADD CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" ADD CONSTRAINT "FK_12dfc4a8cf5af02420eb74fe9c8" FOREIGN KEY ("meterCalibrationStart") REFERENCES "meterCalibration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" ADD CONSTRAINT "FK_977086ae2809483df821b2f6e25" FOREIGN KEY ("meterCalibrationStop") REFERENCES "meterCalibration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meterCalibration" ADD CONSTRAINT "FK_f9fbc6fa83d8c62d61c8668b964" FOREIGN KEY ("meterId") REFERENCES "meter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "meterCalibration" DROP CONSTRAINT "FK_f9fbc6fa83d8c62d61c8668b964"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" DROP CONSTRAINT "FK_977086ae2809483df821b2f6e25"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" DROP CONSTRAINT "FK_12dfc4a8cf5af02420eb74fe9c8"`);
        await queryRunner.query(`ALTER TABLE "pulseDataMultiplier" DROP CONSTRAINT "FK_da4bfa5ec7b4c4ca5e04e0a1c05"`);
        await queryRunner.query(`ALTER TABLE "pulseDataCalculated" DROP CONSTRAINT "FK_28b858c26cb941a699e658d57f1"`);
        await queryRunner.query(`DROP INDEX "PK_DATA_SOURCE_HISTORY" ON "dataSourceHistory"`);
        await queryRunner.query(`DROP TABLE "dataSourceHistory"`);
        await queryRunner.query(`DROP INDEX "PK_LOCATION_HISTORY" ON "locationHistory"`);
        await queryRunner.query(`DROP TABLE "locationHistory"`);
        await queryRunner.query(`DROP INDEX "PK_METER_CALIBRATION_HISTORY" ON "meterCalibrationHistory"`);
        await queryRunner.query(`DROP TABLE "meterCalibrationHistory"`);
        await queryRunner.query(`DROP INDEX "PK_METER_HISTORY" ON "meterHistory"`);
        await queryRunner.query(`DROP TABLE "meterHistory"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_CHANNEL_HISTORY" ON "pulseDataChannelHistory"`);
        await queryRunner.query(`DROP TABLE "pulseDataChannelHistory"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_MULTIPLIER_HISTORY" ON "pulseDataMultiplierHistory"`);
        await queryRunner.query(`DROP TABLE "pulseDataMultiplierHistory"`);
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
        await queryRunner.query(`DROP TABLE "pulseDataMeasurement"`);
        await queryRunner.query(`DROP INDEX "PK_LOCATION" ON "location"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP INDEX "PK_METER_CALIBRATION" ON "meterCalibration"`);
        await queryRunner.query(`DROP TABLE "meterCalibration"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_MULTIPLIER" ON "pulseDataMultiplier"`);
        await queryRunner.query(`DROP TABLE "pulseDataMultiplier"`);
        await queryRunner.query(`DROP INDEX "REL_28b858c26cb941a699e658d57f" ON "pulseDataCalculated"`);
        await queryRunner.query(`DROP INDEX "PK_PULSE_DATA_CALCULATED" ON "pulseDataCalculated"`);
        await queryRunner.query(`DROP INDEX "UQ__PULSE_DATA_CALCULATED_METER_ID" ON "pulseDataCalculated"`);
        await queryRunner.query(`DROP TABLE "pulseDataCalculated"`);
        await queryRunner.query(`DROP INDEX "PK_TOTAL_DATA_CHANNEL_HISTORY" ON "totalDataChannelHistory"`);
        await queryRunner.query(`DROP TABLE "totalDataChannelHistory"`);
    }

}
