import { AppService } from './app.service';
import { DataBaseService } from './data-base/data-base.service';
import { CreateLocationDto } from './data-base/dto/create-location.dto';
export declare class AppController {
    private readonly appService;
    private readonly dataBaseService;
    constructor(appService: AppService, dataBaseService: DataBaseService);
    getHello(): string;
    TESTCreateLocation(createLocationDto: CreateLocationDto): Promise<import("./data-base/entities/data.location.entity").Location>;
}
