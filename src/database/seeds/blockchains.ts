import { BlockchainEntity, BlockchainStatus } from 'entities/blockchain.entity';
import { EntityManager } from 'typeorm';

export async function seed(manager: EntityManager): Promise<void> {
  const blockchainRepository = await manager.getRepository<BlockchainEntity>(
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
      client: 'rinkeby',
      server: 'htttps://rinkeby.infura.io',
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
