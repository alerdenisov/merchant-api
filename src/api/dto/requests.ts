import { ApiModelProperty } from '@nestjs/swagger';
import { Min, IsInt, validate } from 'class-validator';

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
