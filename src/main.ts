import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { setupEnvironment } from './env';
import { ApplicationModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { Currency } from './entities/currency.entity';

const packageJson: {
  version: string;
} = require('../package.json');

async function bootstrap() {
  await setupEnvironment();
  const app = await NestFactory.create(ApplicationModule.forRoot());
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

  // Seed db in dev mode
  if (process.env.NODE_ENV === 'development') {
    const database = app.get(DatabaseService);
    const connection = database.connection;

    await connection.transaction(async em => {
      em.query('SET FOREIGN_KEY_CHECKS = 0;');
      connection.entityMetadatas.forEach(table =>
        em.query(`TRUNCATE table ${table.tableName}`),
      );
      em.query('SET FOREIGN_KEY_CHECKS = 1;');
    });

    const currencyRepository = await database.getRepository<Currency>(Currency);

    await currencyRepository.save(
      [
        ['eth', 18, 'Ethereum', false],
        ['mnc', 18, 'Maincoin', false],
        ['musd', 8, 'Main Cash', true],
      ].map(
        ([symbol, decimals, name, is_fiat]: [
          string,
          number,
          string,
          boolean
        ]) => {
          const newCurrency = currencyRepository.create();
          Object.assign(newCurrency, {
            symbol,
            decimals,
            name,
            is_fiat,
            blockchain: 0,
            confirms: 12,
          });

          return newCurrency;
        },
      ),
    );
  }
}
bootstrap();
