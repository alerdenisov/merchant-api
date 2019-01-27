import { ApiModelProperty } from '@nestjs/swagger';

export const ErrorReasons = {
  validation: true,
  authentication: true,
};

export abstract class BaseApiError<TReason extends keyof typeof ErrorReasons> {
  @ApiModelProperty({
    description: 'Error flag',
    default: true,
    required: true,
  })
  error: true;

  public abstract reason: TReason;
}

export class ValidationApiError extends BaseApiError<'validation'> {
  @ApiModelProperty({
    description: 'Error reason field',
    required: true,
  })
  public reason: 'validation';

  @ApiModelProperty({
    description: 'Object that was validated',
    required: false,
    type: Object,
  })
  target?: Object;

  @ApiModelProperty({
    description: "Object's property that haven't pass validation",
    required: true,
    type: String,
  })
  public property: string;

  @ApiModelProperty({
    description: "Value that haven't pass a validation.",
    required: false,
  })
  public value?: any;
}

export class AuthenticationError extends BaseApiError<'authentication'> {
  @ApiModelProperty({
    description: 'Error reason field',
    required: true,
  })
  public reason: 'authentication';
}
