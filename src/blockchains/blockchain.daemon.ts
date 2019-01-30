import { Injectable } from '@nestjs/common';
import { BlockchainService } from 'blockchains/blockchain.service';

@Injectable()
export class BlockchainDaemon<TBlock> {
  constructor(private readonly service: BlockchainService<TBlock>) {
    this.run();
  }

  async run() {}
}
