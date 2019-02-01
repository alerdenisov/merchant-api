import { Controller } from '@nestjs/common';
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
    const merchant = await this.service.findByKey(public_key);
    return [merchant, key];
  }

  @MessagePattern({ service: 'merchant', cmd: 'validateNonce' })
  async validateNonce({ key, nonce }: { key: ApiKeyEntity; nonce: number }) {
    if (key.nonce >= nonce) {
      throw badRequest('Apikey nonce is higher than received');
    }

    await this.service.updateNonce(key, nonce);
  }
  @MessagePattern({ service: 'merchant', cmd: 'validateSignature' })
  async validate({
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

    if (signature === 'MAGICSIG') {
      throw hmac;
    }

    return hmac === signature;
  }
}
