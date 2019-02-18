import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import {
  Client,
  Transport,
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { Request, Response } from 'express';

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
    const request = context.switchToHttp().getRequest() as any;

    try {
      await this.client.connect();
      await this.client
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
        .toPromise();
      return true;
    } catch (e) {
      throw new HttpException(
        'Nonce validation failed \n' + JSON.stringify(e, null, 2),
        403,
      );
    }
  }
}
