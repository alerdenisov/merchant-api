import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { setupEnvironment } from 'env';
import { ApplicationModule } from 'app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import { MerchantsModule } from 'merchants/merchants.module';
import { DatabaseModule } from 'database/database.module';
import { BlockchainModule } from 'blockchains/blockchain.module';
import { ApiModule } from 'api/api.module';
import { ServiceModule } from 'service.module';
import { Type, DynamicModule, ForwardReference } from '@nestjs/common';
import { TypeormConfig } from 'typeorm-config';
import { ManageModule } from 'manage/manage.module';
import { NotificationModule } from 'notifications/notifications.module';

const packageJson: {
  version: string;
} = require('../package.json');

export const services: {
  [service: string]:
    | Type<any>
    | DynamicModule
    | ((args?: string[]) => DynamicModule)
    | ((args?: string[]) => Promise<DynamicModule>)
    | Promise<DynamicModule>;
} = {
  seedb: (args?: string[]) => DatabaseModule.forRoot(TypeormConfig),
  merchant: MerchantsModule,
  blockchain: (args?: string[]) =>
    BlockchainModule.forRoot(args[args.length - 2]),
  api: ApiModule,
  notification: NotificationModule,
};

function isConstructor<T>(f: Function | Type<T>): f is Type<T> {
  try {
    new new Proxy(<any>f, {
      construct() {
        return {};
      },
    })();
    return true;
  } catch (err) {
    return false;
  }
}

export async function bootstrap() {
  const args = Array.from(process.argv);
  const service: string = args[args.length - 1];
  await setupEnvironment();

  if (typeof services[service] !== 'undefined') {
    if (service === 'api') {
      const api = await NestFactory.create(ApiModule);
      api.enableCors({
        origin: '*',
      });

      api.connectMicroservice({
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL,
          retryAttempts: process.env.MICROSERVICES_RETRY_ATTEMPTS,
          retryDelay: process.env.MICROSERVICES_RETRY_DELAYS,
        },
      });

      const options = new DocumentBuilder()
        .setTitle('Merchant API')
        .setDescription('The Merchant API description')
        .setVersion(packageJson.version)
        .addTag('swagger')
        .build();

      const document = SwaggerModule.createDocument(api, options);
      SwaggerModule.setup('swagger', api, document);

      api.listen(process.env.PORT);
    } else {
      const serviceRef = services[service];
      let module:
        | Type<any>
        | DynamicModule
        | Promise<DynamicModule>
        | ForwardReference;
      if (typeof serviceRef === 'function' && !isConstructor(serviceRef)) {
        module = serviceRef(args);
      } else {
        module = serviceRef;
      }
      const serviceApp = await NestFactory.createMicroservice(
        ServiceModule.forRoot(module),
        {
          transport: Transport.REDIS,
          options: {
            url: process.env.REDIS_URL,
            retryAttempts: process.env.MICROSERVICES_RETRY_ATTEMPTS,
            retryDelay: process.env.MICROSERVICES_RETRY_DELAYS,
          },
        },
      );
      serviceApp.listen(() => console.log(`service ${service} is started`));
    }
  } else {
    throw new Error('unkown service');
  }
}
