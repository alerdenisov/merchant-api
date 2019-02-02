import { Injectable } from '@nestjs/common';
import {
  GetBaseInfoRequest,
  GetNonceRequest,
  CreateTransactionRequest,
  GetTransactionsListRequest,
  GetTransactionInfoRequest,
} from './dto/requests';
import { Request } from 'express';
import * as joi from 'joi';
import {
  ClientProxyFactory,
  ClientProxy,
  Transport,
} from '@nestjs/microservices';
import { CreateTransactionResponse } from './dto/responses';

@Injectable()
export class ApiService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: process.env.REDIS_URL,
        retryAttempts: process.env.MICROSERVICES_RETRY_ATTEMPTS,
        retryDelay: process.env.MICROSERVICES_RETRY_DELAYS,
      },
    });
  }

  getInfo(dto: GetBaseInfoRequest, r: Request): any {
    return (<any>r).merchant;
  }

  getKeyNonce(dto: GetNonceRequest, r: Request): any {
    const { merchantKey } = <any>r;
    return joi.validate(
      merchantKey,
      {
        public_key: joi
          .string()
          .required()
          .length(40),
        nonce: joi.number().required(),
      },
      { stripUnknown: true },
    );
  }

  async createTransaction(
    dto: CreateTransactionRequest,
    r: any,
  ): Promise<CreateTransactionResponse> {
    await this.client.connect();
    return this.client
      .send(
        {
          service: 'merchant',
          cmd: 'createInvoice',
        },
        {
          merchant: r.merchant,
          currency: dto.currency,
          total: dto.amount,
          ipn: dto.ipn,
        },
      )
      .toPromise();
  }

  async getTransactionsList(
    dto: GetTransactionsListRequest,
    r: any,
  ): Promise<any> {
    await this.client.connect();
    return this.client
      .send(
        { service: 'merchant', cmd: 'getInvoices' },
        {
          ...dto,
          merchant: r.merchant,
        },
      )
      .toPromise();
  }

  async getTransaction(dto: GetTransactionInfoRequest, r: any): Promise<any> {
    await this.client.connect();
    return this.client
      .send(
        { service: 'merchant', cmd: 'getInvoice' },
        { id: dto.txid, full: dto.full },
      )
      .toPromise();
  }
}
