import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { BalancesModule } from './balances/balances.module';
import { MerchantsModule } from './merchants/merchants.module';

@Module({
  imports: [ApiModule, BalancesModule, MerchantsModule],
})
export class ApplicationModule {}
