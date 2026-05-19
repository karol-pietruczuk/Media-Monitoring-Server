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
const database_module_1 = require("./infrastructure/database/database.module");
const data_sync_module_1 = require("./feature/data-sync/data-sync.module");
const database_service_1 = require("./infrastructure/database/database.service");
const location_module_1 = require("./domain/location/location.module");
const location_service_1 = require("./domain/location/location.service");
const meter_module_1 = require("./domain/meter/meter.module");
const pulse_data_module_1 = require("./domain/pulse-data/pulse-data.module");
const data_source_module_1 = require("./domain/data-source/data-source.module");
const total_data_module_1 = require("./domain/total-data/total-data.module");
const opcua_module_1 = require("./infrastructure/opcua/opcua.module");
const user_module_1 = require("./domain/user/user.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const auth_module_1 = require("./feature/auth/auth.module");
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
            event_emitter_1.EventEmitterModule.forRoot(),
            data_source_module_1.DataSourceModule,
            location_module_1.LocationModule,
            meter_module_1.MeterModule,
            pulse_data_module_1.PulseDataModule,
            total_data_module_1.TotalDataModule,
            data_sync_module_1.DataSyncModule,
            database_module_1.DataBaseModule,
            opcua_module_1.OpcUaModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, database_service_1.DataBaseService, location_service_1.LocationService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map