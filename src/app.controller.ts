import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DataBaseService } from './infrastructure/database/database.service';
import { CreateLocationDto } from './domain/location/dto/create-location.dto';
import { LocationService } from './domain/location/location.service';
import { OpcUaService } from './infrastructure/opcua/opcua.service';
import { OpcUaConnectionDto } from './infrastructure/opcua/dto/opcua-connection.dto';
import { IOpcUaBulkMapping } from './infrastructure/opcua/interface/opcua-mapping.interface';

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
    const connection: OpcUaConnectionDto = {
      endpointUrl: 'opc.tcp://192.168.92.101:4840',
      securityMode: 'SignAndEncrypt', // Dokładnie tak jak w logu serwera
      securityPolicy: 'Basic256Sha256', // Dokładnie tak jak w logu serwera
      username: 'test',
      password: 'Wipasz123!@#',
    };
    // const mapping: IOpcUaBulkMapping = {
    //   nodeId: 'ns=3;s="DB_Pulse_Counters_Database"."Counters"."Counters_DB"',
    //   meterIdPath: 'ID', // ID pozostało z wielkich liter w logu
    //   extractionPath: 'pulses_to_write', // Zmiana z Pulses_To_Write na małe litery
    //   valuePath: 'pulses', // Zmiana z Pulses na małe litery
    //   timestampPath: 'timestamp', // Zmiana z Timestamp na małe litery
    // };
    const mapping: IOpcUaBulkMapping = {
      // 1. Wracamy do sprawdzonego, poprawnego adresu głównego węzła
      nodeId: 'ns=3;s="DB_Pulse_Counters_Database"."Counters"."Counters_DB"',

      // 2. Wskazujemy dokładne nazwy pól z TIA Portal (Wielkie litery!)
      meterIdPath: 'ID',
      extractionPath: 'pulses_to_write', // node-opcua kolekcje tablicowe mapuje z małych liter
      valuePath: 'pulses', // właściwości wewnątrz struktur Siemens mapuje z małych
      timestampPath: 'timestamp',
    };

    console.log('Rozpoczynam masowy odczyt OPC-UA...');
    const startTime = Date.now();

    const data = await this.opcUaService.readBulk(connection, mapping);

    console.log(`Odczyt zakończony w ${Date.now() - startTime}ms.`);
    console.log(`Pobrano łącznie rekordów: ${data.length}`);

    console.log({ totalCount: data.length, sampleData: data.slice(0, 5) });

    return this.appService.getHello();
  }

  @Post()
  async TESTCreateLocation(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.createLocation(createLocationDto);
  }
}
