import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantsService } from 'merchants/merchants.service';
import { MerchantsController } from 'merchants/merchants.controller';
import { MerchantEntity, MerchantRepository } from 'entities/merchant.entity';
import { InvoiceEntity, InvoiceRepository } from 'entities/invoice.entity';
import { ApiKeyEntity, ApiKeyRepository } from 'entities/api_keys.entity';

@Module({
  providers: [MerchantsService],
  controllers: [MerchantsController],
  imports: [
    TypeOrmModule.forFeature([
      MerchantEntity,
      MerchantRepository,
      InvoiceEntity,
      InvoiceRepository,
      ApiKeyEntity,
      ApiKeyRepository,
    ]),
  ],
})
export class MerchantsModule {}
