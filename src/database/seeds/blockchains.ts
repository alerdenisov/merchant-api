import { BlockchainEntity, BlockchainStatus } from 'entities/blockchain.entity';
import { EntityManager, Connection } from 'typeorm';

export async function seed(connection: Connection): Promise<void> {
  const blockchainRepository = await connection.getRepository<BlockchainEntity>(
    BlockchainEntity,
  );

  const chains: Array<
    Partial<{ [K in keyof BlockchainEntity]: BlockchainEntity[K] }>
  > = [
    {
      client: 'ethereum',
      server: 'https://mainnet.vnode.app/v1/pnH4VBLlsQRzfCTVFBAob',
      key: 'ethereum',
      min_confirmations: 10,
      height: 7000000,
      status: BlockchainStatus.Online,
      name: 'Ethereum',
    },
    {
      client: 'ethereum',
      server: 'https://rinkeby.infura.io',
      key: 'rinkeby',
      min_confirmations: 1,
      status: BlockchainStatus.Online,
      name: 'Ethereum Testnet',
    },
    {
      client: 'ethereum',
      server: 'http://devnet:8545',
      key: 'devnet',
      min_confirmations: 1,
      status: BlockchainStatus.Online,
      name: 'Ethereum Development Network',
    },
  ];

  await blockchainRepository.save(
    chains.map(proto => {
      const entity = blockchainRepository.create();
      return Object.assign(
        entity,
        {
          _meta: '{}',
        } as Partial<BlockchainEntity>,
        proto,
      );
    }),
    {
      transaction: false,
    },
  );
}
