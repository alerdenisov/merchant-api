import {
  Injectable,
  NestMiddleware,
  MiddlewareFunction,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  Client,
} from '@nestjs/microservices';
import { notFound } from 'boom';

@Injectable()
export class MerchantGuard implements CanActivate {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as any;

    return this.client
      .connect()
      .then(() =>
        this.client
          .send(
            {
              service: 'merchant',
              cmd: 'getMerchant',
            },
            {
              public_key: request.body.key,
            },
          )
          .toPromise(),
      )
      .then(([merchant, apikey]) => {
        if (!merchant || !apikey) {
          throw notFound('Merchant or api key not found');
        }
        request.merchant = merchant;
        request.merchantKey = apikey;
        return true;
      })
      .catch(e => {
        return false;
      });
  }
}
