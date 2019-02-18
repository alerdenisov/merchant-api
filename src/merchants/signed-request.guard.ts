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
    try {
      const request = context.switchToHttp().getRequest() as any;
      await this.client.connect();

      await this.client
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
        .toPromise();

      return true;
    } catch (e) {
      throw new HttpException(
        'Signature validation failed \n' + JSON.stringify(e, null, 2),
        403,
      );
    }
  }
}
