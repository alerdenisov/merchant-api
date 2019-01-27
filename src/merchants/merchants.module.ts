import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { Merchant } from './models/merchant.entity';

@Module({
  providers: [MerchantsService],
  controllers: [MerchantsController],
  imports: [TypeOrmModule.forFeature([Merchant])],
})
export class MerchantsModule {}
