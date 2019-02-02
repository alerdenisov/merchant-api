import { Module, DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { ApiModule } from 'api/api.module';
import { BalancesModule } from 'balances/balances.module';
import { MerchantsModule } from 'merchants/merchants.module';
import { DatabaseModule } from 'database/database.module';
import { ManageModule } from 'manage/manage.module';
import { BlockchainModule } from 'blockchains/blockchain.module';
import { TypeOrmModule, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as cors from 'cors';
import { ApiController } from 'api/api.controller';
import { TypeormConfig } from 'typeorm-config';

export class ApplicationModule {
  static forRoot(): DynamicModule {
    return {
      module: ApplicationModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: TypeormConfig,
        }),
        ApiModule,
        // ManageModule,
        // BalancesModule,
        // MerchantsModule,

        // BlockchainModule.forRoot('ethereum'),
        // EthereumModule,
      ],
    };
  }

  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(
  //       cors({
  //         origin: '*',
  //       }),
  //     )
  //     .forRoutes(ApiController);
  // }
}
