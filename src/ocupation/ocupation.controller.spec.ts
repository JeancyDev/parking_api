import { Test, TestingModule } from '@nestjs/testing';
import { OcupationController } from './ocupation.controller';
import { OcupationService } from './ocupation.service';

describe('OcupationController', () => {
  let controller: OcupationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcupationController],
      providers: [OcupationService],
    }).compile();

    controller = module.get<OcupationController>(OcupationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
