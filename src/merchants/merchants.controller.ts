import { Controller, HttpException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MerchantsService } from 'merchants/merchants.service';
import { InvoiceEntity } from 'entities/invoice.entity';

import { stringify } from 'query-string';
import { computeHmac, SupportedAlgorithms } from 'ethers/utils/hmac';
import * as crypto from 'crypto';
import { MerchantEntity } from 'entities/merchant.entity';
import { ApiKeyEntity } from 'entities/api_keys.entity';
import { badRequest } from 'boom';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly service: MerchantsService) {
    console.log('merch sevice');
  }

  @MessagePattern({ service: 'merchant', cmd: 'getInvoice' })
  async getInvoice({ id, populate }: { id: string; populate: boolean }) {
    return this.service.getInvoice(id, populate);
  }

  @MessagePattern({ service: 'merchant', cmd: 'getInvoices' })
  async getInvoices({
    merchant,
    limit = 15,
    start = 0,
    newer = 0,
  }: {
    merchant: MerchantEntity;
    limit?: number;
    start?: number;
    newer?: number;
  }) {
    return this.service.getInvoices({
      merchant,
      limit,
      start,
      newer,
    });
  }
  @MessagePattern({ service: 'merchant', cmd: 'findById' })
  findById(id: number) {
    console.log('call');
    return this.service.findById(id);
  }

  @MessagePattern({ service: 'merchant', cmd: 'createInvoice' })
  createInvoice(invoice: {
    merchant: MerchantEntity;
    currency: string;
    total: number;
    ipn?: string;
  }) {
    return this.service.createInvoice(invoice);
  }

  @MessagePattern({ service: 'merchant', cmd: 'getMerchant' })
  async getMerchant({ public_key }: { public_key: string }) {
    const key = await this.service.findKey(public_key);
    if (!key) {
      throw new Error('Key not found');
    }
    const merchant = await this.service.findByKey(public_key);
    if (!merchant) {
      throw new Error('Merchant not found');
    }
    return [merchant, key];
  }

  @MessagePattern({ service: 'merchant', cmd: 'validateNonce' })
  async validateNonce({ key, nonce }: { key: ApiKeyEntity; nonce: number }) {
    if (key.nonce >= nonce) {
      throw new HttpException(
        `Apikey nonce is higher than received (${key.nonce} >= ${nonce})`,
        400,
      );
    }
    try {
      await this.service.updateNonce(key, nonce);
    } catch (e) {
      return new HttpException(
        'Database error ' + JSON.stringify(e, null, 2),
        400,
      );
    }
  }

  @MessagePattern({ service: 'merchant', cmd: 'validateSignature' })
  async validateSignature({
    key,
    signature,
    payload,
  }: {
    key: ApiKeyEntity;
    signature: string;
    payload: { key: string } & Object;
  }) {
    const privateKey = key.private_key;
    const query = stringify(payload);
    const hmac = crypto
      .createHmac('sha256', privateKey)
      .update(query)
      .digest('hex');

    console.log('hmac and query', query, hmac);

    if (signature === 'MAGICSIG') {
      throw new HttpException('Correct signature is ' + hmac, 400);
    }

    if (hmac === signature) {
      return true;
    } else {
      throw new HttpException('Incorrect signature', 400);
    }
  }
}
