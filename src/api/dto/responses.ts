import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumberString, IsIn } from 'class-validator';

export class GetBasicInfoResponse {
  @ApiModelProperty({
    description: 'Merchant username',
    required: true,
  })
  username: string;

  @ApiModelProperty({
    description: 'Merchant ID (use this to make call)',
    required: true,
  })
  merchant_id: string;

  @ApiModelProperty({
    description: 'Merchant contract email address (setupped in admin panel)',
    required: true,
  })
  email: string;

  @ApiModelProperty({
    description: 'Merchant public display name (May be blank if not set)',
    required: false,
    default: '',
  })
  public_name: string;
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
