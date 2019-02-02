import { BlockchainClient } from 'blockchains/blockchain.client';
import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import {
  BlockchainEntity,
  BlockchainEntityRepository,
} from 'entities/blockchain.entity';
import { CurrencyEntity } from 'entities/currency.entity';
import bn from 'bignumber.js';
import { DepositAddressEntity } from 'entities/deposit-address.entity';
import { ethers } from 'ethers';
import { InjectRepository } from '@nestjs/typeorm';
import { EventDescription, FunctionDescription } from 'ethers/utils';

@Injectable()
export default class EthereumClient extends BlockchainClient {
  static TOKEN_ABI = [
    'event Transfer(address from, address to, uint256 amount)',
    'function balanceOf(address owner)',
    'function transfer(address to, uint256 amount)',
  ];

  chain: BlockchainEntity;
  provider: ethers.providers.BaseProvider;
  contracts: {
    [symbol: string]: ethers.Contract;
  } = {};

  constructor(
    @InjectRepository(BlockchainEntityRepository)
    private readonly blockchainsRepository: BlockchainEntityRepository,
    @Inject('chain') key: string,
  ) {
    super(key);
    this.initialize();
  }

  private async initialize() {
    // TODO: healthcheck
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.chain = await this.blockchainsRepository
      .get(this.key, 'currencies')
      .getOne();

    console.log(this.chain);

    this.provider = new ethers.providers.JsonRpcProvider(
      this.chain.server,
      this.chain.meta ? this.chain.meta['eth_chainId'] : undefined,
    );

    for (let currency of this.chain.currencies) {
      if (currency.meta['eth_erc20']) {
        this.contracts[currency.symbol] = new ethers.Contract(
          currency.meta['eth_contractAddress'],
          EthereumClient.TOKEN_ABI,
          this.provider,
        );
      }
    }

    this.ready = true;
  }

  getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  async getBalance(
    currency: CurrencyEntity,
    depositAddress: DepositAddressEntity,
    real?: boolean,
  ): Promise<bn> {
    if (currency.symbol === 'eth') {
      throw new Error('not implemented');
    }

    return this.contracts[currency.symbol].functions['balanceOf'](
      depositAddress.address,
    );

    // return EthereumClient.TOKEN_BALANCE.decode(
    //   this.provider.call({
    //     data: EthereumClient.TOKEN_BALANCE.encode(depositAddress.address),
    //     to: currency.meta['eth_contractAddress'],
    //   }),
    // );
  }
}
// getBlock(
//   height: number,
// ): Promise<
//   import('/Users/aler/crypto/alex-token/merchant-api/src/blockchains/blockchain.service').BlockModel
// > {
//   throw new Error('Method not implemented.');
// }
// toAddress(
//   tx: import('/Users/aler/crypto/alex-token/merchant-api/src/blockchains/blockchain.service').TransactionModel,
// ): Promise<string> {
//   throw new Error('Method not implemented.');
// }
// fromAddress(
//   tx: import('/Users/aler/crypto/alex-token/merchant-api/src/blockchains/blockchain.service').TransactionModel,
// ): Promise<string> {
//   throw new Error('Method not implemented.');
// }
// buildTransaction(
//   tx: import('/Users/aler/crypto/alex-token/merchant-api/src/blockchains/blockchain.service').TransactionModel,
//   block: import('/Users/aler/crypto/alex-token/merchant-api/src/blockchains/blockchain.service').BlockModel,
// ): any[] {
//   throw new Error('Method not implemented.');
// }
// loadBalance(address: string, currency: CurrencyEntity): Promise<bn> {
//   throw new Error('Method not implemented.');
// }
// loadDeposit(txid: string): Promise<any> {
//   throw new Error('Method not implemented.');
// }
// createAddress(options?: any): Promise<any> {
//   throw new Error('Method not implemented.');
// }
// createWithdrawal(
//   issuer: string,
//   recipient: string,
//   amount: string | number,
//   options?: any,
// ): Promise<any> {
//   throw new Error('Method not implemented.');
// }
// inspectAddress(address: string): Promise<any> {
//   throw new Error('Method not implemented.');
// }
// buildDeposits(block: any): any[] {
//   throw new Error('Method not implemented.');
// }
// buildWithdrawals(block: any): any[] {
//   throw new Error('Method not implemented.');
// }
// // constructor(
// //   connection: Connection,
// //   config: {
// //     currencies: string[];
// //     blockchain: BlockchainEntity;
// //   },
// //   protected readonly client: BlockchainClient,
// // ) {
// //   super(connection, config);
// // }
// // async processBlockchain(limit: number = 250, force: boolean = false) {
// //   const { height, min_confirmations } = this.config.blockchain;
// //   const latestBlock = await this.client.latestBlockNumber;
// //   if (height + min_confirmations >= latestBlock && !force) {
// //     return console.log(
// //       `Skip synchronization. No new blocks detected height: ${height}, latest_block: ${latestBlock}`,
// //     );
// //   }
// //   const fromBlock = height || 0;
// //   const toBlock = Math.min(latestBlock, fromBlock + limit);
// //   return Promise.all(
// //     Array(toBlock - fromBlock)
// //       .fill(0)
// //       .map(async (_, index) => {
// //         const lookupBlockHeight = fromBlock + index;
// //         const block = await this.client.getBlock(lookupBlockHeight);
// //         if (block.transactions == null || !block.transactions.length) {
// //           return;
// //         }
// //         const blockData = {
// //           id: lookupBlockHeight,
// //           deposits: this.buildDeposits(block),
// //           withdrawals: this.buildWithdrawals(block),
// //         };
// //         this.saveBlock(blockData, latestBlock);
// //       }),
// //   );
// // }
// // buildDeposits(block: any): any[] {
// //   // block.transactions.map(tx => {
// //   // })
// //   throw new Error('Method not implemented.');
// // }
// // buildWithdrawals(block: any): any[] {
// //   throw new Error('Method not implemented.');
// // }
// //     def build_deposits(block_json)
// //       block_json
// //         .fetch('transactions')
// //         .each_with_object([]) do |block_txn, deposits|
// //           if block_txn.fetch('input').hex <= 0
// //             txn = block_txn
// //             next if client.invalid_eth_transaction?(txn)
// //           else
// //             txn = client.get_txn_receipt(block_txn.fetch('hash'))
// //             next if txn.nil? || client.invalid_erc20_transaction?(txn)
// //           end
// //           payment_addresses_where(address: client.to_address(txn)) do |payment_address|
// //             deposit_txs = client.build_transaction(txn, block_json, payment_address.address, payment_address.currency)
// //             deposit_txs.fetch(:entries).each do |entry|
// //               if entry[:amount] <= payment_address.currency.min_deposit_amount
// //                 # Currently we just skip small deposits. Custom behavior will be implemented later.
// //                 Rails.logger.info do  "Skipped deposit with txid: #{deposit_txs[:id]} with amount: #{entry[:amount]}"\
// //                                      " from #{entry[:address]} in block number #{deposit_txs[:block_number]}"
// //                 end
// //                 next
// //               end
// //               deposits << { txid:           deposit_txs[:id],
// //                             address:        entry[:address],
// //                             amount:         entry[:amount],
// //                             member:         payment_address.account.member,
// //                             currency:       payment_address.currency,
// //                             txout:          entry[:txout],
// //                             block_number:   deposit_txs[:block_number] }
// //             end
// //           end
// //         end
// //     end
// //     def build_withdrawals(block_json)
// //       block_json
// //         .fetch('transactions')
// //         .each_with_object([]) do |block_txn, withdrawals|
// //           Withdraws::Coin
// //             .where(currency: currencies)
// //             .where(txid: client.normalize_txid(block_txn.fetch('hash')))
// //             .each do |withdraw|
// //             if block_txn.fetch('input').hex <= 0
// //               txn = block_txn
// //               next if client.invalid_eth_transaction?(txn)
// //             else
// //               txn = client.get_txn_receipt(block_txn.fetch('hash'))
// //               if txn.nil? || client.invalid_erc20_transaction?(txn)
// //                 withdraw.fail!
// //                 next
// //               end
// //             end
// //             withdraw_txs = client.build_transaction(txn, block_json, withdraw.rid, withdraw.currency)  # block_txn required for ETH transaction
// //             withdraw_txs.fetch(:entries).each do |entry|
// //               withdrawals << { txid:           withdraw_txs[:id],
// //                                rid:            entry[:address],
// //                                amount:         entry[:amount],
// //                                block_number:   withdraw_txs[:block_number] }
// //             end
// //           end
// //         end
// //     end
// //   end
// // end
