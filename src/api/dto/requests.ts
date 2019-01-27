import { ApiModelProperty } from '@nestjs/swagger';
import { Min, IsInt, validate } from 'class-validator';

export class GetRatesRequest {
  @ApiModelProperty({
    default: false,
    description:
      "If set to `true`, the response won't include the full coin names and number of confirms needed to save bandwidth",
  })
  public short: boolean;

  @ApiModelProperty({
    description:
      'If set to true, the response will include if you have the coin enabled for acceptance on your Coin Acceptance Settings page.',
    default: false,
  })
  public accept: boolean;
}

export class GetBalancesRequest {
  @ApiModelProperty({
    default: false,
    description:
      'If set to `true`, the response will include all coins, even those with a 0 balance.',
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
