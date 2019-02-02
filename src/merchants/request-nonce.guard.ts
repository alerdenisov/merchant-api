import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  Client,
  Transport,
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { Request } from 'express';

@Injectable()
export class NonceRequestGuard implements CanActivate {
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
    console.log('nonce guard ', context);
    const request = context.switchToHttp().getRequest() as any;

    return this.client
      .connect()
      .then(() =>
        this.client
          .send(
            {
              service: 'merchant',
              cmd: 'validateNonce',
            },
            {
              key: request.merchantKey,
              nonce: request.body.nonce,
            },
          )
          .toPromise(),
      )
      .then(() => true)
      .catch(e => false);
  }
}
