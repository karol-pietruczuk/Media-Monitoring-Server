import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778480621296 implements MigrationInterface {
    name = 'Init1778480621296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" int NOT NULL IDENTITY(1,1), "mainLocation" nvarchar(50) NOT NULL, "subLocation" nvarchar(50), "createdAt" datetime NOT NULL CONSTRAINT "DF_09dee1a3d42723079bd45577916" DEFAULT getdate(), CONSTRAINT "UQ_09dee1a3d42723079bd45577916" UNIQUE ("createdAt"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_LOCATION" ON "location" ("id") `);
        await queryRunner.query(`CREATE TABLE "calculatedData" ("id" int NOT NULL IDENTITY(1,1), "pulsesAfterLastCalibration" bigint NOT NULL, "actualValue" numeric(17,4) NOT NULL, "actualTimestamp" datetime NOT NULL CONSTRAINT "DF_d864ebecc9066451a9406e33c83" DEFAULT getdate(), "counterId" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_fb98b771b8233e56483fe4d0e52" DEFAULT getdate(), CONSTRAINT "UQ_7aa415fe44f4b4fb9662c37575b" UNIQUE ("counterId"), CONSTRAINT "UQ_fb98b771b8233e56483fe4d0e52" UNIQUE ("createdAt"), CONSTRAINT "PK_72a92b6590e36f3df7ab4b37132" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ__CALCULATED_DATA_COUNTER_ID" ON "calculatedData" ("counterId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_CALCULATED_DATA" ON "calculatedData" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_7aa415fe44f4b4fb9662c37575" ON "calculatedData" ("counterId") WHERE "counterId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "measurement" ("id" int NOT NULL IDENTITY(1,1), "counterPulses" int NOT NULL, "timestamp" datetime NOT NULL CONSTRAINT "DF_2c83ba2ef3489eb815d222febfd" DEFAULT getdate(), "createdAt" datetime NOT NULL CONSTRAINT "DF_4465c9f6eb8ee1f388ff191ef65" DEFAULT getdate(), "counterId" int, CONSTRAINT "UQ_2c83ba2ef3489eb815d222febfd" UNIQUE ("timestamp"), CONSTRAINT "UQ_4465c9f6eb8ee1f388ff191ef65" UNIQUE ("createdAt"), CONSTRAINT "PK_742ff3cc0dcbbd34533a9071dfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_MEDIA_MEASUREMENT_TIMESTAMP" ON "measurement" ("timestamp") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_MEDIA_MEASUREMENT" ON "measurement" ("id") `);
        await queryRunner.query(`CREATE TABLE "calibration" ("id" int NOT NULL IDENTITY(1,1), "value" numeric(17,4) NOT NULL, "timestamp" datetime NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_4ffbac6c4862d4234ce835257cf" DEFAULT getdate(), "counterId" int, CONSTRAINT "UQ_e316d3046becf218af366cb7cc6" UNIQUE ("timestamp"), CONSTRAINT "PK_f8252d02ac0708df73275ef24a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_CALIBRATION" ON "calibration" ("id") `);
        await queryRunner.query(`CREATE TABLE "multiplierHistory" ("id" int NOT NULL IDENTITY(1,1), "multiplierHistory" numeric(15,10) NOT NULL, "expirationDateFrom" datetime NOT NULL, "expirationDateUntil" datetime, "createdAt" datetime NOT NULL CONSTRAINT "DF_b4c09f965ae936b3248d1f5efac" DEFAULT getdate(), "multiplierHistoryChange" nvarchar(30) NOT NULL, "counterId" int, "multiplierId" int, CONSTRAINT "PK_c93575f392148155be30a91fbac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_MULTIPLIER_HISTORY" ON "multiplierHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "counterHistory" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(50) NOT NULL, "symbol" nvarchar(50) NOT NULL, "unit" nvarchar(30) CONSTRAINT CHK_eac9f298d7ec3e368e48a2e603_ENUM CHECK(unit IN ('l','m³')) NOT NULL CONSTRAINT "DF_fdd28c397cdca8b118fd73dc494" DEFAULT 'm³', "createdAt" datetime NOT NULL CONSTRAINT "DF_b45a890115101f711268d46b1dd" DEFAULT getdate(), "counterrHistoryChange" nvarchar(30) NOT NULL, "locationId" int, "counterId" int, CONSTRAINT "PK_2c91eee5a3647b29468ca0503b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_COUNTER_HISTORY" ON "counterHistory" ("id") `);
        await queryRunner.query(`CREATE TABLE "counter" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(50) NOT NULL, "symbol" nvarchar(50) NOT NULL, "unit" nvarchar(30) CONSTRAINT CHK_189af0ad0ac5e65e4c3f3a05ad_ENUM CHECK(unit IN ('l','m³')) NOT NULL CONSTRAINT "DF_a46408502d591d2029707ed0e43" DEFAULT 'm³', "createdAt" datetime NOT NULL CONSTRAINT "DF_06e54c2a00768029449c9800b5c" DEFAULT getdate(), "locationId" int, CONSTRAINT "PK_012f437b30fcf5a172841392ef3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_COUNTER" ON "counter" ("id") `);
        await queryRunner.query(`CREATE TABLE "multiplier" ("id" int NOT NULL IDENTITY(1,1), "multiplier" numeric(15,10) NOT NULL, "expirationDateFrom" datetime NOT NULL, "expirationDateUntil" datetime, "createdAt" datetime NOT NULL CONSTRAINT "DF_ee55eb30dfdfd8f7f2b20c6f0a4" DEFAULT getdate(), "counterId" int, CONSTRAINT "PK_bb2141848eb2a5ecb71299d5c2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_MULTIPLIER" ON "multiplier" ("id") `);
        await queryRunner.query(`ALTER TABLE "calculatedData" ADD CONSTRAINT "FK_7aa415fe44f4b4fb9662c37575b" FOREIGN KEY ("counterId") REFERENCES "counter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "measurement" ADD CONSTRAINT "FK_d3d0b562442e34229aa1156e7e3" FOREIGN KEY ("counterId") REFERENCES "counter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calibration" ADD CONSTRAINT "FK_be38b82e19eb0fcd196d5a89f25" FOREIGN KEY ("counterId") REFERENCES "counter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "multiplierHistory" ADD CONSTRAINT "FK_5084a4c19a0bb8ef53ab94b80ab" FOREIGN KEY ("counterId") REFERENCES "counter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "multiplierHistory" ADD CONSTRAINT "FK_0f62c1a10c30fd3a5b272192d2d" FOREIGN KEY ("multiplierId") REFERENCES "multiplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "counterHistory" ADD CONSTRAINT "FK_a5d7f7f6eaee68306334553f8a0" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "counterHistory" ADD CONSTRAINT "FK_f57ce89d751bdf0e2270cca46a7" FOREIGN KEY ("counterId") REFERENCES "counter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "counter" ADD CONSTRAINT "FK_1812d6d7b9653d75314d63536e6" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "multiplier" ADD CONSTRAINT "FK_6f662f3c96b7acac1682a7672c2" FOREIGN KEY ("counterId") REFERENCES "counter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "multiplier" DROP CONSTRAINT "FK_6f662f3c96b7acac1682a7672c2"`);
        await queryRunner.query(`ALTER TABLE "counter" DROP CONSTRAINT "FK_1812d6d7b9653d75314d63536e6"`);
        await queryRunner.query(`ALTER TABLE "counterHistory" DROP CONSTRAINT "FK_f57ce89d751bdf0e2270cca46a7"`);
        await queryRunner.query(`ALTER TABLE "counterHistory" DROP CONSTRAINT "FK_a5d7f7f6eaee68306334553f8a0"`);
        await queryRunner.query(`ALTER TABLE "multiplierHistory" DROP CONSTRAINT "FK_0f62c1a10c30fd3a5b272192d2d"`);
        await queryRunner.query(`ALTER TABLE "multiplierHistory" DROP CONSTRAINT "FK_5084a4c19a0bb8ef53ab94b80ab"`);
        await queryRunner.query(`ALTER TABLE "calibration" DROP CONSTRAINT "FK_be38b82e19eb0fcd196d5a89f25"`);
        await queryRunner.query(`ALTER TABLE "measurement" DROP CONSTRAINT "FK_d3d0b562442e34229aa1156e7e3"`);
        await queryRunner.query(`ALTER TABLE "calculatedData" DROP CONSTRAINT "FK_7aa415fe44f4b4fb9662c37575b"`);
        await queryRunner.query(`DROP INDEX "PK_MULTIPLIER" ON "multiplier"`);
        await queryRunner.query(`DROP TABLE "multiplier"`);
        await queryRunner.query(`DROP INDEX "PK_COUNTER" ON "counter"`);
        await queryRunner.query(`DROP TABLE "counter"`);
        await queryRunner.query(`DROP INDEX "PK_COUNTER_HISTORY" ON "counterHistory"`);
        await queryRunner.query(`DROP TABLE "counterHistory"`);
        await queryRunner.query(`DROP INDEX "PK_MULTIPLIER_HISTORY" ON "multiplierHistory"`);
        await queryRunner.query(`DROP TABLE "multiplierHistory"`);
        await queryRunner.query(`DROP INDEX "PK_CALIBRATION" ON "calibration"`);
        await queryRunner.query(`DROP TABLE "calibration"`);
        await queryRunner.query(`DROP INDEX "PK_MEDIA_MEASUREMENT" ON "measurement"`);
        await queryRunner.query(`DROP INDEX "UQ_MEDIA_MEASUREMENT_TIMESTAMP" ON "measurement"`);
        await queryRunner.query(`DROP TABLE "measurement"`);
        await queryRunner.query(`DROP INDEX "REL_7aa415fe44f4b4fb9662c37575" ON "calculatedData"`);
        await queryRunner.query(`DROP INDEX "PK_CALCULATED_DATA" ON "calculatedData"`);
        await queryRunner.query(`DROP INDEX "UQ__CALCULATED_DATA_COUNTER_ID" ON "calculatedData"`);
        await queryRunner.query(`DROP TABLE "calculatedData"`);
        await queryRunner.query(`DROP INDEX "PK_LOCATION" ON "location"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}
