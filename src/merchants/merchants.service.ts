import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity, MerchantRepository } from 'entities/merchant.entity';
import { InvoiceRepository, InvoiceEntity } from 'entities/invoice.entity';
import { ApiKeyRepository } from 'entities/api_keys.entity';
import * as Boom from 'boom';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(MerchantRepository)
    private readonly merchantRepository: MerchantRepository,
    @InjectRepository(InvoiceRepository)
    private readonly invoiceRepository: InvoiceRepository,
    @InjectRepository(ApiKeyRepository)
    private readonly keysRepository: ApiKeyRepository,
  ) {}

  findById(id: number) {
    return this.merchantRepository.findOne(id);
  }

  async findByKey(publickey: string, ...populate: Array<keyof MerchantEntity>) {
    const key = await this.keysRepository
      .findByPublic(publickey, 'merchant')
      .getOne();

    if (!key) {
      throw Boom.notFound('Api key not found');
    }

    if (!key.merchant) {
      throw Boom.notFound('Unknown api key');
    }

    if (!populate || !populate.length) {
      return key.merchant;
    } else {
      return this.merchantRepository
        .findById(key.merchant.id, ...populate)
        .getOne();
    }
  }

  createInvoice(invoice: Partial<InvoiceEntity>): any {
    this.invoiceRepository.save(invoice);
  }
}
