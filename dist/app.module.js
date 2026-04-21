"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configuration_1 = __importDefault(require("./config/configuration"));
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const data_plc_module_1 = require("./data-plc/data-plc.module");
const database_module_1 = require("./database/database.module");
const data_sync_module_1 = require("./data-sync/data-sync.module");
const database_service_1 = require("./database/database.service");
const typeorm_1 = require("@nestjs/typeorm");
const database_counter_entity_1 = require("./database/entities/database.counter.entity");
const database_media_calculated_data_entity_1 = require("./database/entities/database.media-calculated-data.entity");
const database_media_measurement_entity_1 = require("./database/entities/database.media-measurement.entity");
const database_location_entity_1 = require("./database/entities/database.location.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                database_counter_entity_1.Counter,
                database_media_calculated_data_entity_1.MediaCalculatedData,
                database_media_measurement_entity_1.MediaMeasurement,
                database_location_entity_1.Location,
            ]),
            data_plc_module_1.DataPlcModule,
            database_module_1.DataBaseModule,
            data_sync_module_1.DataSyncModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, database_service_1.DataBaseService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map