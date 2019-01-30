import { Module } from '@nestjs/common';
import { BalancesService } from 'balances/balances.service';
import { BalancesController } from 'balances/balances.controller';

@Module({
  providers: [BalancesService],
  controllers: [BalancesController],
})
export class BalancesModule {}
