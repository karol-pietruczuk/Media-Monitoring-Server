// // src/domain/data-source/data-source.service.spec.ts
// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { DataSourceService } from './data-source.service';
// import { DataSource } from './entities/data-source.entity';
// import { DataSourceProtocol } from '../../core/enums/data-source-protocol.enum';

// describe('DataSourceService', () => {
//   let service: DataSourceService;
//   let eventEmitter: EventEmitter2;

//   // Tworzymy sztuczne (wyciszone) repozytorium TypeORM, żeby nie dotykać prawdziwej bazy MSSQL
//   const mockRepository = {
//     create: jest.fn().mockImplementation((dto) => dto),
//     save: jest
//       .fn()
//       .mockImplementation((entity) => Promise.resolve({ id: 1, ...entity })),
//   };

//   const mockEventEmitter = {
//     emit: jest.fn(), // Udajemy emisję zdarzeń
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         DataSourceService,
//         { provide: getRepositoryToken(DataSource), useValue: mockRepository },
//         { provide: EventEmitter2, useValue: mockEventEmitter },
//       ],
//     }).compile();

//     service = module.get<DataSourceService>(DataSourceService);
//     eventEmitter = module.get<EventEmitter2>(EventEmitter2);
//   });

//   it('powinien być zdefiniowany', () => {
//     expect(service).toBeDefined();
//   });

//   it('powinien poprawnie stworzyć źródło danych i wyemitować event', async () => {
//     const dto = {
//       protocol: DataSourceProtocol.Opcua,
//       connectionInfo: { host: 'localhost' },
//     };

//     const result = await service.create(dto, 1);

//     // 1. Sprawdzamy czy serwis zwrócił ID z bazy
//     expect(result.id).toEqual(1);

//     // 2. Sprawdzamy czy poprawnie spakował obiekt do stringu JSON
//     expect(result.connectionInfo).toEqual(
//       JSON.stringify({ host: 'localhost' }),
//     );

//     // 3. Sprawdzamy czy system wyemitował zdarzenie do bazy historii!
//     expect(eventEmitter.emit).toHaveBeenCalledWith(
//       'data-source.updated',
//       expect.any(Object),
//     );
//   });
// });
