// setup env vars before go
import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IsInt, validate, validateOrReject } from 'class-validator';
import * as joi from 'joi';

declare const module: any;

const packageJson: {
  version: string;
} = require('../package.json');

async function bootstrap() {
  joi.validate(process.env, {
    NODE_ENV: joi
      .string()
      .valid(['development', 'test', 'production'])
      .default('development'),
    PORT: joi.number().default(3000),
    CURRENCIES: joi.array().required(),
  });

  const app = await NestFactory.create(ApiModule);

  const options = new DocumentBuilder()
    .setTitle('Merchant API')
    .setDescription('The Merchant API description')
    .setVersion(packageJson.version)
    .addTag('swagger')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
