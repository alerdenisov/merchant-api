import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  Client,
  Transport,
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { Request } from 'express';

@Injectable()
export class SignedRequestGuard implements CanActivate {
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
    const request = context.switchToHttp().getRequest() as any;
    return this.client
      .connect()
      .then(() =>
        this.client
          .send(
            {
              service: 'merchant',
              cmd: 'validateSignature',
            },
            {
              key: request.merchantKey,
              signature: request.headers['hmac'],
              payload: request.body,
            },
          )
          .toPromise(),
      )
      .then(() => true)
      .catch(e => false);
  }
}
