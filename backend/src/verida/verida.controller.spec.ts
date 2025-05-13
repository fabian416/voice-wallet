import { Test, TestingModule } from '@nestjs/testing';
import { VeridaController } from './verida.controller';

describe('VeridaController', () => {
  let controller: VeridaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeridaController],
    }).compile();

    controller = module.get<VeridaController>(VeridaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
