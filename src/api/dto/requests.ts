import { ApiModelProperty } from '@nestjs/swagger';
import {
  Min,
  IsInt,
  validate,
  IsNumberString,
  Validate,
  IsIn,
} from 'class-validator';

const packageJson = require('../../../package.json');

class BaseApiRequest {
  @ApiModelProperty({
    description: 'Api version number (default is latest)',
    default: packageJson.version,
    required: false,
  })
  public version: string;

  @ApiModelProperty({
    description: 'Merchant API public key',
    required: true,
  })
  public key: string;

  @ApiModelProperty({
    description:
      'An integer that is always higher than in your previous API call to prevent replay attack',
    required: true,
  })
  public nonce: number;

  @ApiModelProperty({
    description:
      'The format of response to return, json, xml, grpc. (default: json)',
    default: 'json',
    required: false,
  })
  public format: string;
}

class PaginatedRequest extends BaseApiRequest {
  @ApiModelProperty({
    type: Number,
    required: false,
    minimum: 1,
    maximum: 100,
    default: 25,
    description:
      'The maximum number of items to return from 1-100. (default: 25)',
  })
  public limit: number;

  @ApiModelProperty({
    type: Number,
    required: false,
    default: 0,
    description:
      'Amount of items to skip before return (default: 0, starts from first entry)',
  })
  public start: number;

  @ApiModelProperty({
    type: Number,
    required: false,
    default: 0,
    description:
      'Return items created at the given Unix timestamp or later. (default: 0)',
  })
  public newer: number;
}

export class GetBaseInfoRequest extends BaseApiRequest {}

export class GetRatesRequest extends BaseApiRequest {
  @ApiModelProperty({
    default: false,
    description:
      "If set to `true`, the response won't include the full coin names and number of confirms needed to save bandwidth",
    required: false,
  })
  public short: boolean;

  @ApiModelProperty({
    description:
      'If set to true, the response will include if you have the coin enabled for acceptance on your Coin Acceptance Settings page.',
    default: false,
    required: false,
  })
  public accept: boolean;
}

export class GetBalancesRequest extends BaseApiRequest {
  @ApiModelProperty({
    default: false,
    description:
      'If set to `true`, the response will include all coins, even those with a 0 balance.',
    required: false,
  })
  public all: boolean;
}

export class GetDepositAddressRequest extends BaseApiRequest {
  @ApiModelProperty({
    description: 'The currency the buyer will be sending.',
    required: true,
  })
  @IsIn(process.env.CURRENCIES)
  public currency: string;
}

export class CreateTransactionRequest extends BaseApiRequest {
  @ApiModelProperty({
    description:
      'The amount of the transaction in the original currency (currency1 below).',
    required: true,
  })
  @IsNumberString()
  public amount: string;

  @ApiModelProperty({
    description:
      'The currency the buyer will be sending. For example if your products are priced in USD but you are receiving MNC, you would use currency=MNC and convertion=MUSD',
    required: true,
  })
  @IsIn(process.env.CURRENCIES)
  public currency: string;

  @ApiModelProperty({
    description:
      'The currency what will be add to your balance after automatic conversion',
    required: false,
  })
  @IsIn(process.env.CURRENCIES)
  public convertion?: string;

  @ApiModelProperty({
    description:
      "Set the buyer's email address. This will let us send them a notice if they underpay or need a refund. We will not add them to our mailing list or spam them or anything like that",
    required: true,
  })
  public buyer_email: string;

  @ApiModelProperty({
    description:
      'URL for your IPN callbacks. If not set it will use the IPN URL in your Edit Settings page if you have one set',
    required: false,
  })
  public ipn?: string;

  @ApiModelProperty({
    isArray: true,
    description:
      'Array of fields for your use, will be on the payment information page and in the IPNs for the transaction.',
    required: false,
  })
  custom: string[];
}

export class CallbackAddressRequest extends BaseApiRequest {
  @ApiModelProperty({
    description:
      'The currency the buyer will be sending. For example if your products are priced in USD but you are receiving MNC, you would use currency=MNC and convertion=MUSD',
    required: true,
  })
  @IsIn(process.env.CURRENCIES)
  public currency: string;
  @ApiModelProperty({
    description:
      'URL for your IPN callbacks. If not set it will use the IPN URL in your Edit Settings page if you have one set',
    required: false,
  })
  public ipn?: string;
  @ApiModelProperty({
    description: 'Optionally sets the address label',
    required: false,
  })
  public label?: string;
}

export class GetTransactionInfoRequest extends BaseApiRequest {
  @ApiModelProperty({
    description:
      'The transaction ID to query (API key must belong to the seller.) \nNote: It is recommended to handle IPNs instead of using this command when possible, it is more efficient and places less load on our servers.',
    required: true,
  })
  public txid: string;

  @ApiModelProperty({
    description:
      'Set to `true` to also include the raw checkout and shipping data for the payment if available. (default: `false`)',
    default: false,
    required: false,
  })
  public full: boolean;
}

export class GetTransactionsInfoRequest extends BaseApiRequest {
  @ApiModelProperty({
    description:
      'Lets you query up to 25 transaction ID(s) (API key must belong to the seller.) \nNote: It is recommended to handle IPNs instead of using this command when possible, it is more efficient and places less load on our servers.',
    required: true,
    isArray: true,
    maxItems: 25,
    minItems: 1,
    type: String,
  })
  public txid: String[];
}

export class GetTransactionsListRequest extends PaginatedRequest {
  @ApiModelProperty({
    description:
      'By default we return an array of TX IDs where you are the seller for use with get_tx_info_multi or get_tx_info. If all is set to `true` returns an array with TX IDs and whether you are the seller or buyer for the transaction.',
    default: false,
    required: false,
  })
  public all: boolean;
}

export class CreateTransferRequest extends BaseApiRequest {
  @ApiModelProperty({
    description: 'The amount of the transfer in the currency below.',
    required: true,
    minimum: 0.001,
  })
  @IsNumberString()
  public amount: string;

  @ApiModelProperty({
    description: 'The cryptocurrency to withdraw. (MNC, MUSD, etc.)',
    required: true,
  })
  @IsIn(process.env.CURRENCIES)
  public currency: string;

  @ApiModelProperty({
    description:
      'The merchant ID to send the funds to, either this OR pbntag must be specified \n Remember: this is a merchant ID and not a username',
    required: true,
  })
  public merchant: string;

  @ApiModelProperty({
    description:
      'If set to 1, withdrawal will complete without 2FA confirmation',
    required: false,
    default: false,
  })
  public auto_confirm: boolean;
}

export class CreateWithdrawalRequest extends BaseApiRequest {
  @ApiModelProperty({
    description: 'The amount of the transfer in the currency below.',
    required: true,
  })
  @IsNumberString()
  public amount: string;

  @ApiModelProperty({
    description:
      'If set to `true`, add the coin TX fee to the withdrawal amount so the sender pays the TX fee instead of the receiver',
    required: false,
    default: false,
  })
  public add_tx_fee: boolean;

  @ApiModelProperty({
    description: 'The cryptocurrency to withdraw. (MNC, MUSD, etc.)',
    required: true,
  })
  @IsIn(process.env.CURRENCIES)
  public currency: string;

  @ApiModelProperty({
    description:
      'The address or merchant ID or $PayByName to send the funds to',
    required: true,
  })
  public receiver: string;

  @ApiModelProperty({
    description:
      'If set to 1, withdrawal will complete without 2FA confirmation',
    required: false,
    default: false,
  })
  public auto_confirm: boolean;

  @ApiModelProperty({
    description:
      'URL for your IPN callbacks. If not set it will use the IPN URL in your Edit Settings page if you have one set',
    required: false,
  })
  public ipn?: string;

  @ApiModelProperty({
    description: 'Optionally sets the label for a withdrawal',
    required: false,
  })
  public label?: string;

  @ApiModelProperty({
    isArray: true,
    description:
      'Array of fields for your use, will be on the payment information page and in the IPNs for the transaction.',
    required: false,
  })
  custom: string[];
}

export class CreateWithdrawalBulkRequest extends BaseApiRequest {
  @ApiModelProperty({
    description:
      'The withdrawals are passed in an associative array called wd (max count: 100)',
    required: true,
    isArray: true,
    minItems: 1,
    maxItems: 100,
    type: CreateWithdrawalRequest,
  })
  public wd: CreateWithdrawalRequest[];
}

export class GetWithdrawalHistoryRequest extends PaginatedRequest {}

export class GetWithdrawalInfoRequest extends BaseApiRequest {
  @ApiModelProperty({
    description: 'The withdrawal ID to query',
    required: true,
  })
  public id: string;
}
