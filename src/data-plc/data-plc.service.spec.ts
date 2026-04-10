import { Test, TestingModule } from '@nestjs/testing';
import { DataPlcService } from './data-plc.service';

describe('PlcService', () => {
  let service: DataPlcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataPlcService],
    }).compile();

    service = module.get<DataPlcService>(DataPlcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
