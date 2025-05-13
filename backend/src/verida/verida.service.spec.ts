import { Test, TestingModule } from '@nestjs/testing';
import { VeridaService } from './verida.service';

describe('VeridaService', () => {
  let service: VeridaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeridaService],
    }).compile();

    service = module.get<VeridaService>(VeridaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
