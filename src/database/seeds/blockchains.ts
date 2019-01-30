import { BlockchainEntity, BlockchainStatus } from 'entities/blockchain.entity';
import { Connection } from 'typeorm';

export async function seed(connection: Connection): Promise<void> {
  console.log('seed currencies');
  const blockchainRepository = await connection.getRepository<BlockchainEntity>(
    BlockchainEntity,
  );

  const chains: Array<
    Partial<{ [K in keyof BlockchainEntity]: BlockchainEntity[K] }>
  > = [
    {
      client: 'ethereum',
      server: 'ethereum',
      key: 'ethereum',
      min_confirmations: 10,
      height: 7000000,
      status: BlockchainStatus.Online,
      name: 'Ethereum',
    },
    {
      client: 'rinkeby',
      server: 'rinkeby',
      key: 'rinkeby',
      min_confirmations: 1,
      status: BlockchainStatus.Online,
      name: 'Ethereum Testnet',
    },
  ];

  await blockchainRepository.save(
    chains.map(proto => {
      const entity = blockchainRepository.create();
      return Object.assign(entity, {} as Partial<BlockchainEntity>, proto);
    }),
  );
}
