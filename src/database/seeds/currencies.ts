import { Currency } from 'entities/currency.entity';
import { Connection } from 'typeorm';
import { BlockchainEntity } from 'entities/blockchain.entity';

export async function seed(connection: Connection): Promise<void> {
  console.log('seed currencies');
  const currencyRepository = await connection.getRepository<Currency>(Currency);
  const blockchainRepository = await connection.getRepository<BlockchainEntity>(
    BlockchainEntity,
  );
  await currencyRepository.save(
    await Promise.all(
      [
        ['eth', 18, 'Ethereum', false, 'ethereum'],
        ['mnc', 18, 'Maincoin', false, 'ethereum'],
        ['musd', 8, 'Main Cash', true, 'rinkeby'],
      ].map(
        async ([symbol, decimals, name, is_fiat, key]: [
          string,
          number,
          string,
          boolean,
          string
        ]) => {
          const newCurrency = currencyRepository.create();
          Object.assign(newCurrency, {
            symbol,
            decimals,
            name,
            is_fiat,
            confirms: 12,
          });

          newCurrency.blockchain = await blockchainRepository.findOne({
            where: { key },
          });

          return newCurrency;
        },
      ),
    ),
  );
}
