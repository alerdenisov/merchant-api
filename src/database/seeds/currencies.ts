import { CurrencyEntity } from 'entities/currency.entity';
import { Connection, EntityManager } from 'typeorm';
import { BlockchainEntity } from 'entities/blockchain.entity';

export async function seed(connection: Connection): Promise<void> {
  const currencyRepository = await connection.getRepository<CurrencyEntity>(
    CurrencyEntity,
  );
  const blockchainRepository = await connection.getRepository<BlockchainEntity>(
    BlockchainEntity,
  );

  const coins: Array<{
    symbol: string;
    decimals: number;
    name: string;
    fiat: boolean;
    chain: string;
    meta?: any;
    blockchain?: BlockchainEntity;
  }> = [
    {
      symbol: 'eth',
      decimals: 18,
      name: 'Ethereum',
      fiat: false,
      chain: 'ethereum',
    },
    {
      symbol: 'mnc',
      decimals: 18,
      name: 'Maincoin',
      fiat: false,
      chain: 'ethereum',
      meta: {
        eth_erc20: true,
        eth_contractAddress: '0x9f0f1Be08591AB7d990faf910B38ed5D60e4D5Bf',
      },
    },
    {
      symbol: 'tmnc',
      decimals: 18,
      name: 'Test Maincoin',
      fiat: false,
      chain: 'devnet',
      meta: {
        eth_erc20: true,
        eth_contractAddress: '0xacfbbebe1736e2bea98975220ac5a7fb37825bc9',
      },
    },
    {
      symbol: 'musd',
      decimals: 8,
      name: 'Main Cash',
      fiat: true,
      chain: 'rinkeby',
    },
  ];

  for (let coin of coins) {
    coin.blockchain = await blockchainRepository.findOne({
      where: { key: coin.chain },
    });
  }

  await currencyRepository.save(
    coins.map(({ symbol, decimals, name, fiat, blockchain, meta }) => {
      const newCurrency = currencyRepository.create();
      Object.assign(newCurrency, {
        symbol,
        decimals,
        name,
        is_fiat: fiat,
        confirms: 12,
      });

      newCurrency.meta = meta || {};

      console.log(newCurrency, meta);

      newCurrency.blockchain = blockchain;

      return newCurrency;
    }),
  );
}
