import { ApiModelProperty } from '@nestjs/swagger';
import { Min, IsInt, validate } from 'class-validator';

class PaginatedRequest {
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

export class GetRatesRequest {
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

export class GetBalancesRequest {
  @ApiModelProperty({
    default: false,
    description:
      'If set to `true`, the response will include all coins, even those with a 0 balance.',
    required: false,
  })
  public all: boolean;
}

export class GetDepositAddress {
  @ApiModelProperty({
    description: 'The currency the buyer will be sending.',
    required: true,
  })
  public currency: string;
}

export class CreateTransactionRequest {
  @ApiModelProperty({
    description:
      'The amount of the transaction in the original currency (currency1 below).',
    required: true,
    minimum: 0.001,
  })
  @Min(0.001)
  public amount: number;

  @ApiModelProperty({
    description:
      'The currency the buyer will be sending. For example if your products are priced in USD but you are receiving MNC, you would use currency=MNC and convertion=MUSD',
    required: true,
  })
  public currency: string;

  @ApiModelProperty({
    description:
      'The currency what will be add to your balance after automatic conversion',
    required: false,
  })
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

export class CallbackAddressRequest {
  @ApiModelProperty({
    description:
      'The currency the buyer will be sending. For example if your products are priced in USD but you are receiving MNC, you would use currency=MNC and convertion=MUSD',
    required: true,
  })
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

export class GetTransactionInfoRequest {
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

export class GetTransactionsInfoRequest {
  @ApiModelProperty({
    description:
      'Lets you query up to 25 transaction ID(s) (API key must belong to the seller.) \nNote: It is recommended to handle IPNs instead of using this command when possible, it is more efficient and places less load on our servers.',
    required: true,
    isArray: true,
    maxItems: 25,
    minItems: 1,
    type: [String],
  })
  txid: String[];
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
