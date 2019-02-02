import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { DynamicModule, Type, Inject, Injectable } from '@nestjs/common';
import { DatabaseDaemon } from 'database/database.daemon';
import { Connection } from 'typeorm';
import { TypeormConfig } from 'typeorm-config';
import { InvoiceRepository, InvoiceEntity } from 'entities/invoice.entity';
import {
  NotificationEntity,
  NotificationRepository,
} from 'entities/nofitication.entity';
import {
  BlockchainEntity,
  BlockchainEntityRepository,
} from 'entities/blockchain.entity';

@Injectable()
export class DatabaseClient {
  constructor(private readonly connection: Connection) {
    console.log(connection);
  }
}

export class DatabaseModule {
  static async forRoot(
    func: Type<TypeOrmOptionsFactory>,
  ): Promise<DynamicModule> {
    await new Promise(resolve => setTimeout(resolve, 1));
    // Seed db in dev mode
    return {
      module: DatabaseModule,
      providers: [DatabaseDaemon],
    };
  }
}
