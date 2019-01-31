import { Injectable, Inject } from '@nestjs/common';
import { Connection, EntityManager, In } from 'typeorm';
import { WithdrawalEntity } from 'entities/withdrawal.entity';
import { BlockchainEntity } from 'entities/blockchain.entity';
import { CurrencyEntity } from 'entities/currency.entity';
import bn from 'bignumber.js';
import { DepositAddressEntity } from 'entities/deposit-address.entity';

export interface TransactionModel {}
export interface BlockModel {
  deposits: any[];
  withdrawals: WithdrawalEntity[];
  id: number;
  height: number;
}

export abstract class BlockchainClient {
  ready: boolean;

  constructor(@Inject('chain') protected readonly key: string) {}

  readonly blockNumber: number;
  abstract getBlockNumber(): Promise<number>;
  abstract getBalance(
    currency: CurrencyEntity,
    depositAddress: DepositAddressEntity,
    real?: boolean,
  ): Promise<bn>;
  // constructor(
  //   protected readonly connection: Connection,
  //   protected readonly config: {
  //     currencies: string[];
  //     blockchain: BlockchainEntity;
  //   },
  // ) {}
  // abstract getBlock(height: number): Promise<BlockModel>;
  // abstract toAddress(tx: TransactionModel): Promise<string>;
  // abstract fromAddress(tx: TransactionModel): Promise<string>;
  // abstract loadBalance(address: string, currency: CurrencyEntity): Promise<bn>;
  // abstract loadDeposit(txid: string): Promise<any>;
  // abstract createAddress(options?: any): Promise<any>;
  // abstract createWithdrawal(
  //   issuer: string,
  //   recipient: string,
  //   amount: string | number,
  //   options?: any,
  // ): Promise<any>;
  // abstract inspectAddress(address: string): Promise<any>;
  // convertToBaseUnit(value: string | number | bn, currency: CurrencyEntity): bn {
  //   const r = new bn(value).times(new bn(10).pow(currency.decimals));
  //   if (
  //     r
  //       .modulo(1)
  //       .integerValue()
  //       .eq(0)
  //   ) {
  //     throw new Error(
  //       `Failed to convert value to base (smallest) unit because it exceeds the maximum precision: ${value} - ${r.toString(
  //         10,
  //       )} must be equal to zero.`,
  //     );
  //   }
  //   return r.integerValue();
  // }
  // convertFromBaseUnit(
  //   value: bn | string | number,
  //   currency: CurrencyEntity,
  // ): bn {
  //   return new bn(value).div(new bn(10).pow(currency.decimals));
  // }
  // normalizeAddress(address: string) {
  //   return this.caseSensitive ? address : address.toLowerCase();
  // }
  // normalizeTxid(txid: string) {
  //   return this.caseSensitive ? txid : txid.toLowerCase();
  // }
  // get caseSensitive(): boolean {
  //   return false;
  // }
  // async saveBlock(block: BlockModel, latestBlockNumber: number) {
  //   // block.deposits.map(deposit => deposit.txid)
  //   return this.connection.transaction(async manager => {
  //     await Promise.all([
  //       this.updateOrCreateDeposits(manager, block.deposits),
  //       this.updateWithdrawals(manager, block.withdrawals),
  //       this.updateHeight(manager, block.height, latestBlockNumber),
  //     ]);
  //   });
  // }
  // async updateOrCreateDeposits(manager: EntityManager, deposits: any[]) {
  //   const depositRepository = manager.getRepository<DepositEntity>(
  //     DepositEntity,
  //   );
  //   return depositRepository.save(
  //     deposits.map(deposit => {
  //       const depositEntity = depositRepository.create();
  //       Object.assign(depositEntity, deposit);
  //       return depositEntity;
  //     }),
  //   );
  // }
  // async updateWithdrawals(
  //   manager: EntityManager,
  //   withdrawals: Partial<WithdrawalEntity>[],
  // ) {
  //   const withdrawalRepository = manager.getRepository<WithdrawalEntity>(
  //     WithdrawalEntity,
  //   );
  //   const known = await withdrawalRepository.find({
  //     id: In(withdrawals.map(withdrawal => withdrawal.id)),
  //   });
  //   return withdrawalRepository.save(
  //     known.map(
  //       withdrawal => (
  //         (withdrawal.blockHeight = withdrawals.find(
  //           w => w.id === withdrawal.id,
  //         ).blockHeight),
  //         withdrawal
  //       ),
  //     ),
  //   );
  // }
  // updateHeight(
  //   manager: EntityManager,
  //   height: number,
  //   latestBlockNumber: number,
  // ): any {
  //   if (
  //     latestBlockNumber - height >=
  //     this.config.blockchain.min_confirmations
  //   ) {
  //     const blockchainRepository = manager.getRepository<BlockchainEntity>(
  //       BlockchainEntity,
  //     );
  //     return blockchainRepository.update(
  //       {
  //         id: this.config.blockchain.id,
  //       },
  //       {
  //         height,
  //       },
  //     );
  //   }
  // }
  // abstract buildTransaction(tx: TransactionModel, block: BlockModel): any[];
  // abstract buildDeposits(block: BlockModel): any[];
  // abstract buildWithdrawals(block: BlockModel): any[];
}
