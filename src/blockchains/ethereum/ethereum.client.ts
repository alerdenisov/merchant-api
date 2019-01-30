import { Injectable } from '@nestjs/common';
import { BlockchainClient } from 'blockchains/blockchain.client';
import { Currency } from 'entities/currency.entity';
import { BlockchainEntity } from 'entities/blockchain.entity';
import { Connection } from 'typeorm';
import {
  Client,
  HttpClient,
  JSONRPCErrorLike,
  JSONRPCResultLike,
} from 'jayson';
import { URL } from 'url';
import * as ethers from 'ethers';
import { FunctionDescription, EventDescription } from 'ethers/utils';
import bn from 'bignumber.js';

@Injectable()
export class EthereumClient extends BlockchainClient {
  static TOKEN = new ethers.utils.Interface([
    'event Transfer(address from, address to, uint256 amount)',
    'function balanceOf(address owner)',
    'function transfer(address to, uint256 amount)',
    'function transfer(address to, uint256 amount)',
  ]);
  static TOKEN_TRANSFER_EVENT: EventDescription =
    EthereumClient.TOKEN.events['Transfer'];
  static TOKEN_BALANCE: FunctionDescription =
    EthereumClient.TOKEN.functions['balanceOf'];
  static TOKEN_TRANSFER: FunctionDescription =
    EthereumClient.TOKEN.functions['transfer'];

  static SUCCESS_FLAG = '0x1';
  rpcEndpoint: URL;
  client: HttpClient;

  constructor(
    connection: Connection,
    config: {
      currencies: string[];
      blockchain: BlockchainEntity;
    },
  ) {
    super(connection, config);
    this.rpcEndpoint = new URL(config.blockchain.server);

    this.client = Client.http({
      host: this.rpcEndpoint.host,
      port: this.rpcEndpoint.port,
    });
  }

  call<T>(method: string, params: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this.client.request(
        method,
        params,
        (
          err: JSONRPCErrorLike,
          result: {
            result: T;
          },
        ) => {
          if (err) return reject(err);

          return resolve(result.result);
        },
      );
    });
  }

  loadBalance(address: string, currency: Currency): Promise<bn> {
    if (currency.symbol === 'eth') {
      return this.call<string>('eth_getBalance', [
        this.normalizeAddress(address),
      ]).then(r => new bn(r, 16));
    }

    return this.loadTokenBalance(address, currency);
  }

  loadTokenBalance(address: string, currency: Currency): Promise<bn> {
    const data = EthereumClient.TOKEN_BALANCE.encode([
      this.normalizeAddress(address),
    ]);

    return this.call<string>('eth_call', [
      { to: currency.meta['erc20_contract_address'], data },
      'latest',
    ]).then(result => new bn(result, 16));
  }

  loadDeposit(txid: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  createAddress(options?: { password?: string }): Promise<any> {
    let password =
      options && options.password
        ? options.password
        : Math.random()
            .toString(36)
            .slice(2);

    return this.call<string>('personal_newAccount', [password]).then(address =>
      this.normalizeAddress(address),
    );
  }
  createWithdrawal(
    issuer: string,
    recipient: string,
    amount: string | number,
    options?: any,
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }
  inspectAddress(address: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

// module BlockchainClient
//   class Ethereum < Base

//     TOKEN_EVENT_IDENTIFIER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
//     SUCCESS = '0x1'

//     def initialize(*)
//       super
//       @json_rpc_call_id  = 0
//       @json_rpc_endpoint = URI.parse(blockchain.server)
//     end

//     def endpoint
//       @json_rpc_endpoint
//     end

//     def get_block(height)
//       current_block   = height || 0
//       json_rpc(:eth_getBlockByNumber, ["0x#{current_block.to_s(16)}", true]).fetch('result')
//     end

//     def load_balance!(address, currency)
//       if currency.code.eth?
//         json_rpc(:eth_getBalance, [normalize_address(address), 'latest'])
//           .fetch('result')
//           .hex
//           .to_d
//           .yield_self { |amount| convert_from_base_unit(amount, currency) }
//       else
//         load_balance_of_address(address, currency)
//       end
//     end

//     def load_balance_of_address(address, currency)
//       data = abi_encode('balanceOf(address)', normalize_address(address))
//       json_rpc(:eth_call, [{ to: contract_address(currency), data: data }, 'latest'])
//         .fetch('result')
//         .hex
//         .to_d
//         .yield_self { |amount| convert_from_base_unit(amount, currency) }
//     end

//     def to_address(tx)
//       if tx.has_key?('logs')
//         get_erc20_addresses(tx)
//       else
//         [normalize_address(tx.fetch('to'))]
//       end.compact
//     end

//     def get_erc20_addresses(tx)
//       tx.fetch('logs').map do |log|
//         next if log.fetch('topics').blank? || log.fetch('topics')[0] != TOKEN_EVENT_IDENTIFIER
//         normalize_address('0x' + log.fetch('topics').last[-40..-1])
//       end
//     end

//     def from_address(tx)
//       normalize_address(tx['from'])
//     end

//     def build_transaction(txn, current_block_json, address, currency)
//       if txn.has_key?('logs')
//         build_erc20_transaction(txn, current_block_json, address, currency)
//       else
//         build_eth_transaction(txn, current_block_json, address, currency)
//       end
//     end

//     def latest_block_number
//       Rails.cache.fetch :latest_ethereum_block_number, expires_in: 5.seconds do
//         json_rpc(:eth_blockNumber).fetch('result').hex
//       end
//     end

//     def invalid_eth_transaction?(block_txn)
//       block_txn.fetch('to').blank? \
//       || block_txn.fetch('value').hex.to_d <= 0 && block_txn.fetch('input').hex <= 0 \
//     end

//     def invalid_erc20_transaction?(txn_receipt)
//       txn_receipt.fetch('status') != SUCCESS \
//       || txn_receipt.fetch('to').blank? \
//       || txn_receipt.fetch('logs').blank?
//     end

//     def get_txn_receipt(txid)
//       json_rpc(:eth_getTransactionReceipt, [normalize_txid(txid)]).fetch('result')
//     end

//     # IMPORTANT: Be sure to set the correct value!
//     def case_sensitive?
//       false
//     end

//     def convert_from_base_unit(value, currency)
//       value.to_d / currency.base_factor
//     end

//   protected

//     def connection
//       Faraday.new(@json_rpc_endpoint).tap do |connection|
//         unless @json_rpc_endpoint.user.blank?
//           connection.basic_auth(@json_rpc_endpoint.user, @json_rpc_endpoint.password)
//         end
//       end
//     end
//     memoize :connection

//     def json_rpc(method, params = [])
//       response =   .post \
//         '/',
//         { jsonrpc: '2.0', id: rpc_call_id, method: method, params: params }.to_json,
//         { 'Accept'       => 'application/json',
//           'Content-Type' => 'application/json' }
//       response.assert_success!
//       response = JSON.parse(response.body)
//       response['error'].tap { |error| raise Error, error.inspect if error }
//       response
//     end

//     def rpc_call_id
//       @json_rpc_call_id += 1
//     end

//     def block_information(number)
//       json_rpc(:eth_getBlockByNumber, [number, false]).fetch('result')
//     end

//     def permit_transaction(issuer, recipient)
//       json_rpc(:personal_unlockAccount, [normalize_address(issuer.fetch(:address)), issuer.fetch(:secret), 5]).tap do |response|
//         unless response['result']
//           raise BlockchainClient::Error, \
//             "#{currency.code.upcase} withdrawal from #{normalize_address(issuer[:address])} to #{normalize_address(recipient[:address])} is not permitted."
//         end
//       end
//     end

//     def abi_encode(method, *args)
//       '0x' + args.each_with_object(Digest::SHA3.hexdigest(method, 256)[0...8]) do |arg, data|
//         data.concat(arg.gsub(/\A0x/, '').rjust(64, '0'))
//       end
//     end

//     def abi_explode(data)
//       data = data.gsub(/\A0x/, '')
//       { method:    '0x' + data[0...8],
//         arguments: data[8..-1].chars.in_groups_of(64, false).map { |group| '0x' + group.join } }
//     end

//     def abi_method(data)
//       '0x' + data.gsub(/\A0x/, '')[0...8]
//     end

//     def valid_address?(address)
//       address.to_s.match?(/\A0x[A-F0-9]{40}\z/i)
//     end

//     def valid_txid?(txid)
//       txid.to_s.match?(/\A0x[A-F0-9]{64}\z/i)
//     end

//     def build_eth_transaction(tx, current_block_json, _address, currency)
//       { id:            normalize_txid(tx.fetch('hash')),
//         block_number:  current_block_json.fetch('number').hex,
//         entries:       currency.code.eth? ? build_entries(tx, currency) : [] }
//     end

//     def build_entries(tx, currency)
//       [
//         { amount:  convert_from_base_unit(tx.fetch('value').hex, currency),
//           address: normalize_address(tx['to']) }
//       ]
//     end

//     def build_erc20_transaction(tx, current_block_json, address, currency)
//       entries = tx.fetch('logs').map do |log|

//         next if log.fetch('topics').blank? || log.fetch('topics')[0] != TOKEN_EVENT_IDENTIFIER
//         # Skip if ERC20 contract address doesn't match.
//         next if log.fetch('address') != currency.erc20_contract_address
//         # Skip if address doesn't match.
//         destination_address = normalize_address('0x' + log.fetch('topics').last[-40..-1])
//         next if destination_address != address

//         { amount:  convert_from_base_unit(log.fetch('data').hex, currency),
//           address: destination_address,
//           txout:   log['logIndex'].to_i(16) }
//       end

//       { id:            normalize_txid(tx.fetch('transactionHash')),
//         block_number:  current_block_json.fetch('number').hex,
//         entries:       entries.compact }
//     end

//     def contract_address(currency)
//       normalize_address(currency.erc20_contract_address)
//     end
//   end
// end
