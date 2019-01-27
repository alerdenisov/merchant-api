import { Test, TestingModule } from '@nestjs/testing';
import { BalancesController } from './balances.controller';

describe('Balances Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [BalancesController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: BalancesController = module.get<BalancesController>(BalancesController);
    expect(controller).toBeDefined();
  });
});
