import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DataBaseService } from './infrastructure/database/database.service';
import { CreateLocationDto } from './domain/location/dto/create-location.dto';
import { LocationService } from './domain/location/location.service';
import { OpcUaService } from './infrastructure/opcua/opcua.service';
import { OpcUaConnectionDto } from './infrastructure/opcua/dto/opcua-connection.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataBaseService: DataBaseService,
    private readonly locationService: LocationService,
    private readonly opcUaService: OpcUaService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    // Przykład użycia w procesie synchronizacji
    const connectionJson: OpcUaConnectionDto = {
      endpointUrl: 'opc.tcp://192.168.92.101:4840',
      securityMode: 'SignAndEncrypt', // Dokładnie tak jak w logu serwera
      securityPolicy: 'Basic256Sha256', // Dokładnie tak jak w logu serwera
      username: 'test',
      password: 'Wipasz123!@#',
    };
    const mappingJson = {
      nodeId: 'ns=3;s="DB_Pulse_Counters_Database"."Counters"."Counters_DB"',
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value = await this.opcUaService.readPulseValue(
      connectionJson,
      mappingJson,
    );

    console.log(value);

    return this.appService.getHello();
  }

  @Post()
  async TESTCreateLocation(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.createLocation(createLocationDto);
  }
}
