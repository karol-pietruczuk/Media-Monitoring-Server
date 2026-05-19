import { AppService } from './app.service';
import { DataBaseService } from './infrastructure/database/database.service';
import { LocationService } from './domain/location/location.service';
import { OpcUaService } from './infrastructure/opcua/opcua.service';
export declare class AppController {
    private readonly appService;
    private readonly dataBaseService;
    private readonly locationService;
    private readonly opcUaService;
    constructor(appService: AppService, dataBaseService: DataBaseService, locationService: LocationService, opcUaService: OpcUaService);
    getHello(): Promise<string>;
}
