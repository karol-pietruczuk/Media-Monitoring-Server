import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from './entities/data.location.entity';
export declare class DataBaseService {
    private locationRepository;
    constructor(locationRepository: Repository<Location>);
    createLocation(createLocationDto: CreateLocationDto): Promise<Location>;
}
