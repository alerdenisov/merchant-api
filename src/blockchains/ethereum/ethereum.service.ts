import { BlockchainService } from 'blockchains/blockchain.service';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { BlockchainEntity } from 'entities/blockchain.entity';

export interface BlockchainClient {
  readonly latestBlockNumber: Promise<number>;
  getBlock(height: number): Promise<any>;
}

@Injectable()
export class EthereumService extends BlockchainService<any> {
  constructor(
    connection: Connection,
    config: {
      currencies: string[];
      blockchain: BlockchainEntity;
    },
    protected readonly client: BlockchainClient,
  ) {
    super(connection, config);
  }

  async processBlockchain(limit: number = 250, force: boolean = false) {
    const { height, min_confirmations } = this.config.blockchain;
    const latestBlock = await this.client.latestBlockNumber;
    if (height + min_confirmations >= latestBlock && !force) {
      return console.log(
        `Skip synchronization. No new blocks detected height: ${height}, latest_block: ${latestBlock}`,
      );
    }

    const fromBlock = height || 0;
    const toBlock = Math.min(latestBlock, fromBlock + limit);

    return Promise.all(
      Array(toBlock - fromBlock)
        .fill(0)
        .map(async (_, index) => {
          const lookupBlockHeight = fromBlock + index;
          const block = await this.client.getBlock(lookupBlockHeight);

          if (block.transactions == null || !block.transactions.length) {
            return;
          }

          const blockData = {
            id: lookupBlockHeight,
            deposits: this.buildDeposits(block),
            withdrawals: this.buildWithdrawals(block),
          };

          this.saveBlock(blockData, latestBlock);
        }),
    );
  }

  buildDeposits(block: any): any[] {
    // block.transactions.map(tx => {

    // })
    throw new Error('Method not implemented.');
  }
  buildWithdrawals(block: any): any[] {
    throw new Error('Method not implemented.');
  }

  //     def build_deposits(block_json)
  //       block_json
  //         .fetch('transactions')
  //         .each_with_object([]) do |block_txn, deposits|

  //           if block_txn.fetch('input').hex <= 0
  //             txn = block_txn
  //             next if client.invalid_eth_transaction?(txn)
  //           else
  //             txn = client.get_txn_receipt(block_txn.fetch('hash'))
  //             next if txn.nil? || client.invalid_erc20_transaction?(txn)
  //           end

  //           payment_addresses_where(address: client.to_address(txn)) do |payment_address|
  //             deposit_txs = client.build_transaction(txn, block_json, payment_address.address, payment_address.currency)
  //             deposit_txs.fetch(:entries).each do |entry|
  //               if entry[:amount] <= payment_address.currency.min_deposit_amount
  //                 # Currently we just skip small deposits. Custom behavior will be implemented later.
  //                 Rails.logger.info do  "Skipped deposit with txid: #{deposit_txs[:id]} with amount: #{entry[:amount]}"\
  //                                      " from #{entry[:address]} in block number #{deposit_txs[:block_number]}"
  //                 end
  //                 next
  //               end
  //               deposits << { txid:           deposit_txs[:id],
  //                             address:        entry[:address],
  //                             amount:         entry[:amount],
  //                             member:         payment_address.account.member,
  //                             currency:       payment_address.currency,
  //                             txout:          entry[:txout],
  //                             block_number:   deposit_txs[:block_number] }
  //             end
  //           end
  //         end
  //     end

  //     def build_withdrawals(block_json)
  //       block_json
  //         .fetch('transactions')
  //         .each_with_object([]) do |block_txn, withdrawals|

  //           Withdraws::Coin
  //             .where(currency: currencies)
  //             .where(txid: client.normalize_txid(block_txn.fetch('hash')))
  //             .each do |withdraw|

  //             if block_txn.fetch('input').hex <= 0
  //               txn = block_txn
  //               next if client.invalid_eth_transaction?(txn)
  //             else
  //               txn = client.get_txn_receipt(block_txn.fetch('hash'))
  //               if txn.nil? || client.invalid_erc20_transaction?(txn)
  //                 withdraw.fail!
  //                 next
  //               end
  //             end

  //             withdraw_txs = client.build_transaction(txn, block_json, withdraw.rid, withdraw.currency)  # block_txn required for ETH transaction
  //             withdraw_txs.fetch(:entries).each do |entry|
  //               withdrawals << { txid:           withdraw_txs[:id],
  //                                rid:            entry[:address],
  //                                amount:         entry[:amount],
  //                                block_number:   withdraw_txs[:block_number] }
  //             end
  //           end
  //         end
  //     end
  //   end
  // end
}
