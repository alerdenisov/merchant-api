import { DynamicModule, Inject, Type } from '@nestjs/common';
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
import {
  NotificationEntity,
  NotificationRepository,
} from 'entities/nofitication.entity';

export class BlockchainModule {
  static async forRoot(key: string): Promise<DynamicModule> {
    const temporaryConnection = new Connection(
      new TypeormConfig().createTypeOrmOptions(),
    );
    const connection = await temporaryConnection.connect();
    if (!connection.isConnected) {
      throw new Error('unable to connect');
    }
    const repository = connection.getCustomRepository<
      BlockchainEntityRepository
    >(BlockchainEntityRepository);

    const chain = await repository.get(key, 'currencies').getOne();

    if (!chain) {
      throw new Error('Chain not found!');
    }

    return {
      module: BlockchainModule,
      providers: [
        {
          provide: BlockchainEntity,
          useValue: chain,
        },
        {
          provide: BlockchainClient,
          useClass: require(`./${chain.client}/${chain.client}.client`)
            .default as Type<BlockchainClient>,
        },
        BlockchainDemon,
      ],
      imports: [
        TypeOrmModule.forFeature([
          InvoiceEntity,
          InvoiceRepository,
          NotificationEntity,
          NotificationRepository,
          BlockchainEntity,
          BlockchainEntityRepository,
        ]),
      ],
      exports: [BlockchainClient],
    };
  }
}
