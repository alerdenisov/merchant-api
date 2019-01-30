import { Module } from '@nestjs/common';
import { EthereumService } from 'blockchains/ethereum/ethereum.service';
import { EthereumController } from 'blockchains/ethereum/ethereum.controller';
import { Connection } from 'typeorm';
import { BlockchainEntity } from 'entities/blockchain.entity';

const ethereumServiceProvider = {
  provide: 'EthereumService',
  useFactory: async (connection: Connection) => {
    const repository = await connection.getRepository<BlockchainEntity>(
      BlockchainEntity,
    );
    const blockchain = await repository
      .createQueryBuilder('blockchain')
      .leftJoinAndSelect('blockchain.currencies', 'currency')
      .where('blockchain.key = :key', { key: 'ethereum' })
      .getOne();

    console.log(blockchain);
    return new EthereumService(
      connection,
      {
        blockchain,
        currencies: blockchain.currencies.map(c => c.symbol),
      },
      null,
    );
  },
  inject: [Connection],
};

@Module({
  providers: [ethereumServiceProvider],
  imports: [EthereumController],
  exports: ['EthereumService'],
})
export class EthereumModule {
  constructor(private readonly ethereum: EthereumService) {
    console.log(this.ethereum);
  }
}
