import { Test, TestingModule } from '@nestjs/testing';
import { OcupationService } from './ocupation.service';

describe('OcupationService', () => {
  let service: OcupationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OcupationService],
    }).compile();

    service = module.get<OcupationService>(OcupationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
