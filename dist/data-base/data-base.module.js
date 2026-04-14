"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const data_base_service_1 = require("./data-base.service");
const typeorm_1 = require("@nestjs/typeorm");
const data_counters_entity_1 = require("./entities/data.counters.entity");
const data_locations_entity_1 = require("./entities/data.locations.entity");
const data_media_measurements_entity_1 = require("./entities/data.media-measurements.entity");
const data_media_calculated_data_entity_1 = require("./entities/data.media-calculated-data.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mssql',
                host: '192.168.92.100',
                port: 1433,
                username: 'Node_User',
                password: '123',
                database: 'Test',
                autoLoadEntities: true,
                synchronize: true,
                options: {
                    encrypt: false,
                    trustServerCertificate: true,
                },
                entities: [data_counters_entity_1.Counters, data_media_calculated_data_entity_1.MediaCalculatedData, data_media_measurements_entity_1.MediaMeasurements, data_locations_entity_1.Locations],
            }),
        ],
        providers: [data_base_service_1.DataBaseService],
    })
], DatabaseModule);
//# sourceMappingURL=data-base.module.js.map