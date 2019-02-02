import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity, MerchantRepository } from 'entities/merchant.entity';
import { InvoiceRepository, InvoiceEntity } from 'entities/invoice.entity';
import { ApiKeyRepository, ApiKeyEntity } from 'entities/api_keys.entity';
import * as Boom from 'boom';
import * as joi from 'joi';
import { CurrencyEntity, CurrencyRepository } from 'entities/currency.entity';
import { BlockchainEntityRepository } from 'entities/blockchain.entity';
import shortid = require('shortid');
import {
  DepositAddressEntity,
  DepositAddressRepository,
} from 'entities/deposit-address.entity';
import bn from 'bignumber.js';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(MerchantRepository)
    private readonly merchantRepository: MerchantRepository,
    @InjectRepository(DepositAddressRepository)
    private readonly depositAddressRepository: DepositAddressRepository,
    @InjectRepository(CurrencyRepository)
    private readonly currenciesRepository: CurrencyRepository,
    @InjectRepository(BlockchainEntityRepository)
    private readonly blockchainRepository: BlockchainEntityRepository,
    @InjectRepository(InvoiceRepository)
    private readonly invoiceRepository: InvoiceRepository,
    @InjectRepository(ApiKeyRepository)
    private readonly keysRepository: ApiKeyRepository,
  ) {}

  findById(id: number) {
    return this.merchantRepository.findOne(id);
  }

  async findKey(publickey: string, ...populate: Array<keyof ApiKeyEntity>) {
    return this.keysRepository.findByPublic(publickey, ...populate).getOne();
  }

  async findByKey(publickey: string, ...populate: Array<keyof MerchantEntity>) {
    const key = await this.findKey(publickey, 'merchant');

    if (!key) {
      return null;
    }

    if (!populate || !populate.length) {
      return key.merchant;
    } else {
      return this.merchantRepository
        .findById(key.merchant.id, ...populate)
        .getOne();
    }
  }

  async updateNonce(key: ApiKeyEntity, nonce: number) {
    return this.keysRepository.update({ id: key.id }, { nonce });
  }

  async createInvoice({
    merchant,
    currency,
    total,
    ipn,
  }: {
    merchant: MerchantEntity;
    currency: string;
    total: number;
    ipn?: string;
  }) {
    // key: string;
    // currency: CurrencyEntity;
    // merchant: MerchantEntity;
    // created_at: Date;
    // updated_at: Date;
    // expires: Date;
    // ipn: string;
    // notifications: NotificationEntity[];
    // depositAddress: DepositAddressEntity;
    // status: InvoiceStatus;
    // total: number;
    // confirmation_block: number;
    // paid: number;
    const currencyEntity = await this.currenciesRepository.findOne({
      relations: ['blockchain'],
      where: {
        symbol: currency,
      },
    });

    if (!currency) {
      throw Boom.notFound('Currency not found');
    }

    if (total <= 0) {
      throw Boom.badRequest('Total should be more than 0');
    }

    const invoice = this.invoiceRepository.create();
    invoice.total = new bn(total)
      .times(new bn(10).pow(currencyEntity.decimals))
      .toString(10);

    invoice.key = shortid.generate();
    invoice.expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    invoice.currency = currencyEntity;
    invoice.blockchain = currencyEntity.blockchain;
    invoice.merchant = merchant;
    invoice.ipn = ipn || invoice.merchant.ipn;
    invoice.depositAddress = await this.depositAddressRepository.createRandom(
      currencyEntity,
      merchant,
    );

    return this.invoiceRepository.save(invoice);
  }

  async getInvoices({
    merchant,
    limit,
    start,
    newer,
  }: {
    merchant: MerchantEntity;
    limit: number;
    start: number;
    newer: number;
  }): Promise<any> {
    return this.invoiceRepository
      .getList(
        merchant,
        start,
        limit,
        newer,
        'depositAddress',
        'blockchain',
        'currency',
      )
      .getMany();
  }
}
