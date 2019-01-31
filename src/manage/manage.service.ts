import { Injectable } from '@nestjs/common';
import { BlockchainEntity } from 'entities/blockchain.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class ManageService {
  repositories: {
    blockchain: Repository<BlockchainEntity>;
  };

  constructor(private readonly connection: Connection) {
    this.repositories = {
      blockchain: this.connection.getRepository<BlockchainEntity>(
        BlockchainEntity,
      ),
    };
  }

  getBlockchains(currencies?: boolean): Promise<BlockchainEntity[]> {
    let query = this.repositories.blockchain.createQueryBuilder('blockchain');

    if (currencies) {
      query = query.leftJoinAndSelect('blockchain.currencies', 'currency');
    }

    return query.getMany();
  }
}
