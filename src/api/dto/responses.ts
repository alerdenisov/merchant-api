import { ApiModelProperty } from '@nestjs/swagger';

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
