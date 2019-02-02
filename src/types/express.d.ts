import * as express from 'express';
import { ApiKeyEntity } from 'entities/api_keys.entity';
import { MerchantEntity } from 'entities/merchant.entity';

declare namespace Express {
  export interface Request {
    merchantKey: ApiKeyEntity;
    merchant: MerchantEntity;
  }
}
