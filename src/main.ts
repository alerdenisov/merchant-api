import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

declare const module: any;

const packageJson: {
  version: string;
} = require('../package.json');

async function bootstrap() {
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
