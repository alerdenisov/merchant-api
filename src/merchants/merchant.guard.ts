import {
  Injectable,
  NestMiddleware,
  MiddlewareFunction,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  Client,
} from '@nestjs/microservices';
import { notFound } from 'boom';
import { MerchantEntity } from 'entities/merchant.entity';
import { ApiKeyEntity } from 'entities/api_keys.entity';

@Injectable()
export class MerchantGuard implements CanActivate {
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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as any;

      await this.client.connect();
      const [merchant, apikey]: [
        MerchantEntity,
        ApiKeyEntity
      ] = await this.client
        .send(
          {
            service: 'merchant',
            cmd: 'getMerchant',
          },
          {
            public_key: request.body.key,
          },
        )
        .toPromise();

      if (!merchant || !apikey) {
        throw notFound('Merchant or api key not found');
      }

      request.merchant = merchant;
      request.merchantKey = apikey;
      return true;
    } catch (e) {
      throw new HttpException(
        'Merchant error \n' + JSON.stringify(e, null, 2),
        403,
      );
    }
  }
}
