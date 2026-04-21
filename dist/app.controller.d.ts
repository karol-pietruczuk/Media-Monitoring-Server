import { AppService } from './app.service';
import { DataBaseService } from './database/database.service';
import { CreateLocationDto } from './database/dto/create-location.dto';
export declare class AppController {
    private readonly appService;
    private readonly dataBaseService;
    constructor(appService: AppService, dataBaseService: DataBaseService);
    getHello(): string;
    TESTCreateLocation(createLocationDto: CreateLocationDto): Promise<import("./database/entities/database.location.entity").Location>;
}
