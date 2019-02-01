import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  Client,
} from '@nestjs/microservices';

@Injectable()
export class MerchantMiddleware implements NestMiddleware {
  @Client({ transport: Transport.TCP })
  private client: ClientProxy;

  resolve(): MiddlewareFunction {
    // console.log('merch', args);
    // const client = ClientProxyFactory.create({
    //   transport: Transport.TCP,
    // });
    // client.connect();
    return function(req, res, next) {
      console.log(arguments);
      next();
      // console.log('begin merch');
      // console.log('begin client merch');
      // client
      //   .connect()
      //   .then(() =>
      //     client
      //       .send(
      //         {
      //           service: 'merchant',
      //           cmd: 'getMerchant',
      //         },
      //         {
      //           public_key: req.body.key,
      //         },
      //       )
      //       .toPromise(),
      //   )
      //   .then(([merchant, apikey]) => {
      //     req.merchant = merchant;
      //     req.merchantKey = apikey;
      //     next();
      //   })
      //   .catch(e => {
      //     console.log('errrror', e);
      //     next();
      //   });
    };
  }
}
