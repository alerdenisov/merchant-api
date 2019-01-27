import { Module, DynamicModule } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { BalancesModule } from './balances/balances.module';
import { MerchantsModule } from './merchants/merchants.module';
import { DatabaseModule } from './database/database.module';

export class ApplicationModule {
  static forRoot(): DynamicModule {
    console.log(process.env);
    return {
      module: ApplicationModule,
      imports: [
        DatabaseModule.forRoot({
          type: <any>process.env.DATABASE_TYPE,
          host: process.env.DATABASE_HOST,
          port: process.env.DATABASE_PORT,
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_DB,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        }),
        ApiModule,
        BalancesModule,
        MerchantsModule,
      ],
    };
  }
}
