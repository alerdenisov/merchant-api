import { Injectable } from '@nestjs/common';
import { Connection, EntityManager, In } from 'typeorm';
import { DepositEntity } from 'entities/deposit.entity';
import { WithdrawalEntity } from 'entities/withdrawal.entity';
import { BlockchainEntity } from 'entities/blockchain.entity';

export abstract class BlockchainService<TBlock> {
  constructor(
    protected readonly connection: Connection,
    protected readonly config: {
      currencies: string[];
      blockchain: BlockchainEntity;
    },
  ) {}

  async saveBlock(block: any, latestBlockNumber: number) {
    // block.deposits.map(deposit => deposit.txid)
    return this.connection.transaction(async manager => {
      await Promise.all([
        this.updateOrCreateDeposits(manager, block.deposits),
        this.updateWithdrawals(manager, block.withdrawals),
        this.updateHeight(manager, block.id, latestBlockNumber),
      ]);
    });
  }

  async updateOrCreateDeposits(manager: EntityManager, deposits: any[]) {
    const depositRepository = manager.getRepository<DepositEntity>(
      DepositEntity,
    );

    return depositRepository.save(
      deposits.map(deposit => {
        const depositEntity = depositRepository.create();
        Object.assign(depositEntity, deposit);
        return depositEntity;
      }),
    );
  }

  async updateWithdrawals(
    manager: EntityManager,
    withdrawals: Partial<WithdrawalEntity>[],
  ) {
    const withdrawalRepository = manager.getRepository<WithdrawalEntity>(
      WithdrawalEntity,
    );

    const known = await withdrawalRepository.find({
      id: In(withdrawals.map(withdrawal => withdrawal.id)),
    });

    return withdrawalRepository.save(
      known.map(
        withdrawal => (
          (withdrawal.blockHeight = withdrawals.find(
            w => w.id === withdrawal.id,
          ).blockHeight),
          withdrawal
        ),
      ),
    );
  }

  updateHeight(
    manager: EntityManager,
    height: number,
    latestBlockNumber: number,
  ): any {
    if (
      latestBlockNumber - height >=
      this.config.blockchain.min_confirmations
    ) {
      const blockchainRepository = manager.getRepository<BlockchainEntity>(
        BlockchainEntity,
      );
      return blockchainRepository.update(
        {
          id: this.config.blockchain.id,
        },
        {
          height,
        },
      );
    }
  }

  abstract buildDeposits(block: TBlock): any[];
  abstract buildWithdrawals(block: TBlock): any[];
}
//     def payment_addresses_where(options = {})
//       options = { currency: currencies }.merge(options)
//       PaymentAddress
//         .includes(:currency)
//         .where(options)
//         .each do |payment_address|
//           yield payment_address if block_given?
//         end
//     end

//     def wallets_where(options = {})
//       options = { currency: currencies,
//                   kind: %i[cold warm hot] }.merge(options)
//       Wallet
//         .includes(:currency)
//         .where(options)
//         .each do |wallet|
//           yield wallet if block_given?
//         end
//     end
//   end
// end
