import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantsService } from 'merchants/merchants.service';
import { MerchantsController } from 'merchants/merchants.controller';
import { MerchantEntity, MerchantRepository } from 'entities/merchant.entity';
import { InvoiceEntity, InvoiceRepository } from 'entities/invoice.entity';
import { ApiKeyEntity, ApiKeyRepository } from 'entities/api_keys.entity';
import {
  DepositAddressEntity,
  DepositAddressRepository,
} from 'entities/deposit-address.entity';
import { CurrencyEntity, CurrencyRepository } from 'entities/currency.entity';
import {
  BlockchainEntity,
  BlockchainEntityRepository,
} from 'entities/blockchain.entity';
import { TypeormConfig } from 'typeorm-config';

@Module({
  providers: [MerchantsService],
  controllers: [MerchantsController],
  imports: [
    TypeOrmModule.forFeature([
      MerchantEntity,
      MerchantRepository,
      DepositAddressEntity,
      DepositAddressRepository,
      CurrencyEntity,
      CurrencyRepository,
      BlockchainEntity,
      BlockchainEntityRepository,
      InvoiceEntity,
      InvoiceRepository,
      ApiKeyEntity,
      ApiKeyRepository,
    ]),
  ],
})
export class MerchantsModule {}
