import { AppService } from './app.service';
import { DataBaseService } from './database/database.service';
export declare class AppController {
    private readonly appService;
    private readonly dataBaseService;
    constructor(appService: AppService, dataBaseService: DataBaseService);
    getHello(): string;
}
