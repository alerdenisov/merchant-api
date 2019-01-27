import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { setupEnvironment } from './env';
import { ApplicationModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const packageJson: {
  version: string;
} = require('../package.json');

async function bootstrap() {
  setupEnvironment();

  const app = await NestFactory.create(ApplicationModule);
  console.log(typeof process.env.MICROSERVICES_RETRY_ATTEMPTS);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
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

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT);
}
bootstrap();
