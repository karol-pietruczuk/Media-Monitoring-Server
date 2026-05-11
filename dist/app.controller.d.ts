import { AppService } from './app.service';
import { DataBaseService } from './database/database.service';
import { CreateLocationDto } from './location/dto/create-location.dto';
import { LocationService } from './location/location.service';
export declare class AppController {
    private readonly appService;
    private readonly dataBaseService;
    private readonly locationService;
    constructor(appService: AppService, dataBaseService: DataBaseService, locationService: LocationService);
    getHello(): string;
    TESTCreateLocation(createLocationDto: CreateLocationDto): Promise<import("./location/entities/location.entity").Location>;
}
