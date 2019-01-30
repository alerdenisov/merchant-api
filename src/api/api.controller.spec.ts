import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from 'api/api.controller';

describe('Api Controller', () => {
  let controller: ApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('informational endpoints', () => {
    describe('/basic_info', () => {
      it('should response', async () => {});
    });
    describe('/rates', () => {
      it('should response', async () => {});
    });
    describe('/balances', () => {
      it('should response', async () => {});
    });
    describe('/deposit_address', () => {
      it('should response', async () => {});
    });
    describe('/create_transaction', () => {
      it('should response', async () => {});
    });
    describe('/callback_address', () => {
      it('should response', async () => {});
    });
    describe('/tx_info', () => {
      it('should response', async () => {});
    });
    describe('/txs_info', () => {
      it('should response', async () => {});
    });
    describe('/txs', () => {
      it('should response', async () => {});
    });
    describe('/create_transfer', () => {
      it('should response', async () => {});
    });
    describe('/create_withdrawal', () => {
      it('should response', async () => {});
    });
    describe('/withdrawal_history', () => {
      it('should response', async () => {});
    });
    describe('/withdrawal_info', () => {
      it('should response', async () => {});
    });
  });
});
