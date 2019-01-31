import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantsService } from 'merchants/merchants.service';
import { MerchantsController } from 'merchants/merchants.controller';
import { MerchantEntity } from 'entities/merchant.entity';

@Module({
  providers: [MerchantsService],
  controllers: [MerchantsController],
  imports: [TypeOrmModule.forFeature([MerchantEntity])],
})
export class MerchantsModule {}
