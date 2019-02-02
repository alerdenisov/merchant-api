import { DynamicModule, Inject } from '@nestjs/common';
import { Connection, Repository, In, UpdateResult } from 'typeorm';
import {
  BlockchainEntity,
  BlockchainEntityRepository,
} from 'entities/blockchain.entity';
import { BlockchainClient } from 'blockchains/blockchain.client';
import {
  InvoiceEntity,
  InvoiceStatus,
  InvoiceRepository,
} from 'entities/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainDemon } from './blockchain.demon';
import { TypeormConfig } from 'typeorm-config';

function keyToClass(key: string): new () => BlockchainClient {
  return require(`./${key}/${key}.client`).default;
}

function makeBlockchainClientProvider(key: string) {
  return {
    provide: BlockchainClient,
    useClass: keyToClass(key),
  };
}

export class BlockchainModule {
  static forRoot(key: string): DynamicModule {
    const keyProvider = {
      provide: 'chain',
      useValue: key,
    };
    return {
      module: BlockchainModule,
      providers: [
        makeBlockchainClientProvider(key),
        BlockchainDemon,
        keyProvider,
      ],
      imports: [
        TypeOrmModule.forFeature([
          InvoiceEntity,
          InvoiceRepository,
          BlockchainEntity,
          BlockchainEntityRepository,
        ]),
      ],
      exports: [BlockchainClient],
    };
  }
}
