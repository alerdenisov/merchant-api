import { CurrencyEntity } from 'entities/currency.entity';
import { Connection, EntityManager } from 'typeorm';
import { BlockchainEntity } from 'entities/blockchain.entity';

export async function seed(manager: EntityManager): Promise<void> {
  const currencyRepository = await manager.getRepository<CurrencyEntity>(
    CurrencyEntity,
  );
  const blockchainRepository = await manager.getRepository<BlockchainEntity>(
    BlockchainEntity,
  );
  await currencyRepository.save(
    await Promise.all(
      [
        ['eth', 18, 'Ethereum', false, 'ethereum'],
        [
          'mnc',
          18,
          'Maincoin',
          false,
          'ethereum',
          {
            eth_erc20: true,
            eth_contractAddress: '0x9f0f1Be08591AB7d990faf910B38ed5D60e4D5Bf',
          },
        ],
        ['musd', 8, 'Main Cash', true, 'rinkeby'],
      ].map(
        async ([symbol, decimals, name, is_fiat, key, meta]: [
          string,
          number,
          string,
          boolean,
          string,
          any
        ]) => {
          const newCurrency = currencyRepository.create();
          Object.assign(newCurrency, {
            symbol,
            decimals,
            name,
            is_fiat,
            confirms: 12,
          });

          newCurrency.meta = meta || {};

          console.log(newCurrency, meta);

          newCurrency.blockchain = await blockchainRepository.findOne({
            where: { key },
          });

          return newCurrency;
        },
      ),
    ),
  );
}
