"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const database_service_1 = require("./infrastructure/database/database.service");
const location_service_1 = require("./domain/location/location.service");
const opcua_service_1 = require("./infrastructure/opcua/opcua.service");
let AppController = class AppController {
    appService;
    dataBaseService;
    locationService;
    opcUaService;
    constructor(appService, dataBaseService, locationService, opcUaService) {
        this.appService = appService;
        this.dataBaseService = dataBaseService;
        this.locationService = locationService;
        this.opcUaService = opcUaService;
    }
    async getHello() {
        const connection = {
            endpointUrl: 'opc.tcp://192.168.92.101:4840',
            securityMode: 'SignAndEncrypt',
            securityPolicy: 'Basic256Sha256',
            username: 'test',
            password: 'Wipasz123!@#',
        };
        const mapping = {
            nodeId: 'ns=3;s="DB_Pulse_Counters_Database"."Counters"."Counters_DB"',
            meterIdPath: 'ID',
            extractionPath: 'pulses_to_write',
            valuePath: 'pulses',
            timestampPath: 'timestamp',
        };
        console.log('Rozpoczynam masowy odczyt OPC-UA...');
        const startTime = Date.now();
        const data = await this.opcUaService.readBulk(connection, mapping);
        console.log(`Odczyt zakończony w ${Date.now() - startTime}ms.`);
        console.log(`Pobrano łącznie rekordów: ${data.length}`);
        console.log({ totalCount: data.length, sampleData: data.slice(0, 5) });
        const meter18Data = data.filter((dat) => dat.meterId === 18);
        console.log({ meter18length: meter18Data.length });
        console.log(meter18Data);
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        database_service_1.DataBaseService,
        location_service_1.LocationService,
        opcua_service_1.OpcUaService])
], AppController);
//# sourceMappingURL=app.controller.js.map