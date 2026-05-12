import { AppService } from './app.service';
import { DataBaseService } from './infrastructure/database/database.service';
import { CreateLocationDto } from './domain/location/dto/create-location.dto';
import { LocationService } from './domain/location/location.service';
export declare class AppController {
    private readonly appService;
    private readonly dataBaseService;
    private readonly locationService;
    constructor(appService: AppService, dataBaseService: DataBaseService, locationService: LocationService);
    getHello(): string;
    TESTCreateLocation(createLocationDto: CreateLocationDto): Promise<import("./domain/location/entities/location.entity").Location>;
}
