import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsIn,
  IsEmail,
  IsPositive,
  IsInt,
  IsOptional,
  IsDate,
  IsUrl,
} from 'class-validator';

export class GetBasicInfoResponse {
  // @ApiModelProperty({
  //   description: 'Merchant username',
  //   required: true,
  // })
  // username: string;

  // merchant_id: string;

  // email: string;

  // public_name: string;

  @ApiModelProperty({
    description: 'Merchant ID (use this to make call to manage api)',
    required: true,
  })
  @IsPositive()
  @IsInt()
  public id: number;

  @ApiModelProperty({
    description: 'Merchant contract email address (setupped in admin panel)',
    required: true,
  })
  @IsEmail()
  public email: string;

  @ApiModelProperty({
    description: 'Merchant public display name (May be blank if not set)',
    required: false,
    default: '',
  })
  @IsOptional()
  public displayName?: string;

  @ApiModelProperty({
    description: 'Merchant registration date (can be used as a proof of trust)',
  })
  @IsDate()
  public createdAt: Date;

  @ApiModelProperty({
    description: 'Merchant default notification url (May be blank if not set)',
    required: false,
    default: '',
  })
  @IsOptional()
  @IsUrl()
  public ipn?: string | null;
}

export class CurrencyResponse {
  @ApiModelProperty({
    description: 'Currency short symbol (using as ID)',
    required: true,
  })
  public symbol: string;

  @ApiModelProperty({
    description: 'Currency decimal points',
    required: true,
  })
  public decimals: number;

  @ApiModelProperty({
    description: 'Currency is fiat flag',
    required: true,
    default: false,
  })
  public is_fiat: boolean;

  @ApiModelProperty({
    description: 'Currency rate to BTC',
    required: true,
  })
  public rate_btc: number;

  @ApiModelProperty({
    description: 'Currency rate to USD',
    required: true,
  })
  public rate_usd: number;

  @ApiModelProperty({
    description: 'Currency rate to MNC',
    required: true,
  })
  public rate_mnc: number;

  @ApiModelProperty({
    description: 'Timestamp of latest currency update',
    required: true,
  })
  public last_update: number;

  @ApiModelProperty({
    description: 'Receive currency transaction fee',
    required: true,
  })
  public receive_fee: number;

  @ApiModelProperty({
    description: 'Send currency transaction fee',
    required: true,
  })
  public send_fee: number;

  @ApiModelProperty({
    description: 'Currency status in system',
    enum: ['online', 'disabled', 'maintaince'],
    default: 'online',
    required: true,
  })
  public status: 'online' | 'disabled' | 'maintaince';

  @ApiModelProperty({
    description: 'Currency human-readable name',
    required: true,
  })
  public name: string;

  @ApiModelProperty({
    description:
      'Currency confirmation policy (Min number of confirmation to set as irreversible)',
  })
  public confirms: number;

  @ApiModelProperty({
    description: 'Currency available functionality',
    enum: ['payments', 'wallet', 'transfers', 'convert'],
    required: true,
    isArray: true,
  })
  public capabilities: ['payments' | 'wallet' | 'transfers' | 'convert'];
}

export class GetNonceResponse {
  @ApiModelProperty({
    required: true,
    description: 'Public key of the mercant',
  })
  public_key: string;

  @ApiModelProperty({
    required: true,
    description: 'Current nonce of provided key',
  })
  nonce: number;
}

export class GetRatesResponse {
  @ApiModelProperty({
    isArray: true,
    type: CurrencyResponse,
    required: true,
  })
  public list: Array<CurrencyResponse>;
}

export class BalanceResponse {
  @ApiModelProperty({
    description: "The coin balance as an integer in 'Satoshis'",
    required: true,
  })
  @IsNumberString()
  public real_balance: string;

  @ApiModelProperty({
    description: 'The coin balance as floating number (possible float error)',
    required: true,
  })
  public balance: number;

  @ApiModelProperty({
    description: 'The coint balance symbol',
    required: true,
  })
  @IsIn(process.env.CURRENCIES)
  public currency: string;
}

export class GetBalancesResponse {
  @ApiModelProperty({
    isArray: true,
    type: BalanceResponse,
    required: true,
  })
  balances: BalanceResponse[];
}

export class GetDepositAddressResponse {
  @ApiModelProperty({
    description:
      'The address to deposit the selected coin into your merchant wallet',
    required: true,
  })
  public address: string;

  @ApiModelProperty({
    description:
      'For currencies needing a destination tag, payment ID, etc. (like Ripple or Monero) to set for depositing into your merchant wallet',
    required: false,
  })
  public tag: string;
}

// export const exampleCreateTransactionResponse = {
//   total: '100000000000000000000',
//   key: 'Z0vvme75B',
//   expires: '2019-02-04T07:25:09.584Z',
//   currency: {
//     id: 3,
//     symbol: 'tmnc',
//     name: 'Test Maincoin',
//     decimals: 18,
//     is_fiat: false,
//     rate_btc: 0,
//     rate_usd: 0,
//     rate_mnc: 0,
//     create_at: '2019-02-02T18:48:46.058Z',
//     update_at: '2019-02-02T18:48:46.058Z',
//     receive_fee: 0,
//     send_fee: 0,
//     status: 0,
//     confirms: 12,
//     capabilities_payments: true,
//     capabilities_wallet: true,
//     capabilities_transfers: true,
//     capabilities_convert: true,
//     _meta:
//       '{"eth_erc20":true,"eth_contractAddress":"0xacfbbebe1736e2bea98975220ac5a7fb37825bc9"}',
//     blockchain: {
//       id: 3,
//       key: 'devnet',
//       name: 'Ethereum Development Network',
//       client: 'ethereum',
//       server: 'http://devnet:8545',
//       height: 0,
//       min_confirmations: 1,
//       status: 0,
//       created_at: '2019-02-02T18:48:46.028Z',
//       updated_at: '2019-02-02T18:48:46.028Z',
//       _meta: '{}',
//     },
//   },
//   blockchain: {
//     id: 3,
//     key: 'devnet',
//     name: 'Ethereum Development Network',
//     client: 'ethereum',
//     server: 'http://devnet:8545',
//     height: 0,
//     min_confirmations: 1,
//     status: 0,
//     created_at: '2019-02-02T18:48:46.028Z',
//     updated_at: '2019-02-02T18:48:46.028Z',
//     _meta: '{}',
//   },
//   merchant: {
//     id: 1,
//     email: 'admin@maincoin.money',
//     displayName: 'Maincoin MerchantEntity',
//     createdAt: '2019-02-02T18:48:46.069Z',
//     ipn: null,
//   },
//   ipn: 'http://localhost:4000/api/notify',
//   depositAddress: {
//     privateKey:
//       '0xe72a26990305112a823a56c458d017af325bf0745ef0c88ea627be4a852b046d',
//     address: '0xb5c5fAD61C25B1867AaB5Ee06480ABCd6742FE50',
//     currency: {
//       id: 3,
//       symbol: 'tmnc',
//       name: 'Test Maincoin',
//       decimals: 18,
//       is_fiat: false,
//       rate_btc: 0,
//       rate_usd: 0,
//       rate_mnc: 0,
//       create_at: '2019-02-02T18:48:46.058Z',
//       update_at: '2019-02-02T18:48:46.058Z',
//       receive_fee: 0,
//       send_fee: 0,
//       status: 0,
//       confirms: 12,
//       capabilities_payments: true,
//       capabilities_wallet: true,
//       capabilities_transfers: true,
//       capabilities_convert: true,
//       _meta:
//         '{"eth_erc20":true,"eth_contractAddress":"0xacfbbebe1736e2bea98975220ac5a7fb37825bc9"}',
//       blockchain: {
//         id: 3,
//         key: 'devnet',
//         name: 'Ethereum Development Network',
//         client: 'ethereum',
//         server: 'http://devnet:8545',
//         height: 0,
//         min_confirmations: 1,
//         status: 0,
//         created_at: '2019-02-02T18:48:46.028Z',
//         updated_at: '2019-02-02T18:48:46.028Z',
//         _meta: '{}',
//       },
//     },
//     merchant: {
//       id: 1,
//       email: 'admin@maincoin.money',
//       displayName: 'Maincoin MerchantEntity',
//       createdAt: '2019-02-02T18:48:46.069Z',
//       ipn: null,
//     },
//     id: 3,
//     createdAt: '2019-02-03T07:25:09.827Z',
//     updatedAt: '2019-02-03T07:25:09.827Z',
//     fee: 0,
//   },
//   created_at: '2019-02-03T07:25:09.849Z',
//   updated_at: '2019-02-03T07:25:09.849Z',
//   status: 'pending',
//   paid: '0',
//   confirmation_block: 0,
// };
export class CreateTransactionResponse {
  @ApiModelProperty({
    description: 'The amount for the buyer to send in the destination currency',
    required: true,
  })
  @IsNumberString()
  public amount: string;

  @ApiModelProperty({
    description: 'The address the buyer needs to send the coins to',
    required: true,
  })
  public address: string;

  @ApiModelProperty({
    description: 'Internal transaction ID',
    required: true,
  })
  public txid: string;

  @ApiModelProperty({
    description:
      'The number of confirms needed for the transaction to be complete',
    required: true,
  })
  public confirms_needed: number;

  @ApiModelProperty({
    description:
      'How long the buyer has to send the coins and have them be confirmed in seconds.',
    required: true,
  })
  public timeout: number;
  @ApiModelProperty({
    description:
      'URL where the buyer can view the payment progress and leave feedback for you',
    required: true,
  })
  public status_url: string;

  @ApiModelProperty({
    description:
      "A URL to a QR code you can display for buyer's paying with a QR supporting wallet",
    required: true,
  })
  public qrcode_url: string;
}

export class CallbackAddressResponse {
  @ApiModelProperty({
    description:
      'The address to deposit the selected coin into your CoinPayments Wallet.',
    required: true,
  })
  public address: string;

  @ApiModelProperty({
    description:
      'For currencies needing a destination tag, payment ID, etc. (like Ripple or Monero) to set for depositing into your merchant wallet',
    required: false,
  })
  public tag: string;
}

export class CreateTransferResponse {
  @ApiModelProperty({
    description:
      'Internal transfer/withdrawal ID. (This is not a coin network TX ID.)',
    required: true,
  })
  public id: string;

  @ApiModelProperty({
    description: 'Withdrawal status',
    enum: ['cancelled', 'email_confirmation', 'pending', 'complete'],
    required: true,
  })
  public status: string;
}

export class CreateWithdrawalResponse {
  @ApiModelProperty({
    description:
      'Internal transfer/withdrawal ID. (This is not a coin network TX ID.)',
    required: true,
  })
  public id: string;

  @ApiModelProperty({
    description: 'Withdrawal status',
    enum: ['cancelled', 'email_confirmation', 'pending', 'complete'],
    required: true,
  })
  public status: string;

  @ApiModelProperty({
    description: 'Amount of coins is sending with withdrawal',
    required: true,
  })
  @IsNumberString()
  amount: string;
}

export class WithdrawalInfoResponse {
  @ApiModelProperty({
    description:
      'Internal transfer/withdrawal ID. (This is not a coin network TX ID.)',
    required: true,
  })
  public id: string;

  @ApiModelProperty({
    description: 'Unix timestamp of creation time',
    required: true,
  })
  public time_created: number;

  @ApiModelProperty({
    description: 'Withdrawal status',
    enum: ['cancelled', 'email_confirmation', 'pending', 'complete'],
    required: true,
  })
  public status: string;

  @ApiModelProperty({
    description: 'The ticker symbol of the coin for the withdrawal',
    required: true,
  })
  @IsIn(process.env.CURRENCIES)
  public currency: string;

  @ApiModelProperty({
    description: ' The amount of the withdrawal (in Satoshis)',
    required: true,
  })
  @IsNumberString()
  public real_amount: string;

  @ApiModelProperty({
    description: 'The amount of the withdrawal (as a floating point number)',
    required: true,
  })
  public amount: number;

  @ApiModelProperty({
    description:
      'The address the withdrawal was sent to. (only in response if status is completed)',
    required: false,
  })
  public send_address?: string;

  @ApiModelProperty({
    description:
      'The destination tag/payment ID/etc. the withdrawal was sent to. (only in response if coin supports destination tags/payment IDs/etc.)',
    required: false,
  })
  public send_dest_tag?: string;

  @ApiModelProperty({
    description:
      'The coin TX ID of the send. (only in response if status is completed)',
    required: false,
  })
  public send_txid?: string;
}
