import { Module, DynamicModule } from '@nestjs/common';
import { ApiModule } from 'api/api.module';
import { BalancesModule } from 'balances/balances.module';
import { MerchantsModule } from 'merchants/merchants.module';
import { DatabaseModule } from 'database/database.module';
import { ManageModule } from 'manage/manage.module';
import { BlockchainModule } from 'blockchains/blockchain.module';
import { TypeOrmModule, TypeOrmOptionsFactory } from '@nestjs/typeorm';
// import { EthereumModule } from 'blockchains/ethereum/ethereum.module';

class TypeormConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions() {
    return Object.assign(
      {
        synchronize: true,
        logging: true,
      },
      {
        type: <any>process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      },
    );
  }
}

export class ApplicationModule {
  static forRoot(): DynamicModule {
    return {
      module: ApplicationModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: TypeormConfig,
        }),
        DatabaseModule.forRoot(TypeormConfig),
        ApiModule,
        ManageModule,
        BalancesModule,
        MerchantsModule,

        BlockchainModule.forRoot('ethereum'),
        // EthereumModule,
      ],
    };
  }
}
