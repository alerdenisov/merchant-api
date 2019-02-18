import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  CanActivate,
  UseInterceptors,
} from '@nestjs/common';
import { ApiService } from 'api/api.service';
import {
  GetRatesRequest,
  GetBalancesRequest,
  GetDepositAddressRequest,
  CreateTransactionRequest,
  CallbackAddressRequest,
  GetTransactionInfoRequest,
  GetTransactionsInfoRequest,
  GetTransactionsListRequest,
  CreateTransferRequest,
  CreateWithdrawalRequest,
  CreateWithdrawalBulkRequest,
  GetWithdrawalHistoryRequest,
  GetWithdrawalInfoRequest,
  GetBaseInfoRequest,
  GetNonceRequest,
} from 'api/dto/requests';
import {
  ApiOkResponse,
  ApiOperation,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ResponseMetadata,
  ApiImplicitHeaders,
  ApiImplicitBody,
} from '@nestjs/swagger';
import {
  GetBasicInfoResponse,
  GetRatesResponse,
  GetBalancesResponse,
  GetDepositAddressResponse,
  CreateTransactionResponse,
  CallbackAddressResponse,
  CreateTransferResponse,
  CreateWithdrawalResponse,
  WithdrawalInfoResponse,
  GetNonceResponse,
} from 'api/dto/responses';
import { AuthenticationError, ValidationApiError } from 'api/dto/errors';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { SignedRequestGuard } from 'merchants/signed-request.guard';
import { MerchantGuard } from 'merchants/merchant.guard';
import { Request as HttpRequest } from 'express';
import { NonceRequestGuard } from 'merchants/request-nonce.guard';
import { stringify } from 'querystring';
import * as crypto from 'crypto';
import * as rawbody from 'raw-body';

interface MethodOperationMeta {
  title: string;
  description?: string;
  operationId?: string;
  deprecated?: boolean;
}

type MethodResponseMeta = ResponseMetadata;

interface MethodImplicitHeadersMeta {
  name: string;
  description?: string;
  required?: boolean;
}

interface MethodSchema {
  guards?: Array<Function | CanActivate>;
  operation: MethodOperationMeta;
  ok: MethodResponseMeta;
  forbidden?: MethodResponseMeta;
  badRequest?: MethodResponseMeta;
  headers?: MethodImplicitHeadersMeta[];
}

type methods = keyof ApiController;

const defaultForbidden = {
  description: 'Forbinned',
  type: AuthenticationError,
};
const defaultBadRequest = {
  description: 'Call has been reject while processing',
  type: ValidationApiError,
};
const defaultHeaders = [
  {
    name: 'HMAC',
    description: 'Payload signature based on merchant secret phrase',
  },
];
const defaultGuards: Array<Function | CanActivate> = [
  MerchantGuard,
  SignedRequestGuard,
  NonceRequestGuard,
];

const apiSchema: { [method in methods]?: MethodSchema } = {
  getBasicInfo: {
    operation: {
      title: 'Get basic account information',
      description:
        'Returns object with identification string and private data setupped in admin panel',
    },
    ok: {
      description: 'The bacis information has been successefully received',
      type: GetBasicInfoResponse,
    },
  },
  getNonce: {
    guards: [MerchantGuard, SignedRequestGuard],
    operation: {
      title: 'Get api key nonce',
      description: 'Return current nonce of providen key',
    },
    ok: {
      description: 'The nonce has been successefully received',
      type: GetNonceResponse,
    },
  },
  createTransaction: {
    operation: {
      title: 'Create Transaction',
      description:
        "This API is for making your own custom checkout page so buyers don't have to leave your website to complete payment",
    },
    ok: {
      description: 'Transaction repeipt has been successefully created',
      type: CreateTransactionResponse,
    },
  },
  getTransactionInfo: {
    operation: {
      title: 'Get Transaction Information',
      description:
        'Return transaction details. \nNote: If at all possible you should use the Instant Payment Notification (IPN) system to receive notifications about payments instead of using this polled interface.',
    },
    ok: {
      description: '',
    },
  },
  getTransactionsList: {
    operation: {
      title: 'Get Transaction List IDs',
      description:
        'Return paginated list of known merchant transactions\nNote: If at all possible you should use the Instant Payment Notification (IPN) system to receive notifications about payments instead of using this polled interface.',
    },
    ok: {
      description: '',
    },
  },
  // getRates: {
  //   operation: {
  //     title: 'Convertion Rates / Coin List',
  //     description: 'Returns convertion rates and supported coins list',
  //   },
  //   ok: {
  //     description: 'The list of coin has been successefully received',
  //     type: GetRatesResponse,
  //   },
  // },
  // getBalances: {
  //   operation: {
  //     title: 'Coins Balances',
  //     description: 'Returns list of available balances',
  //   },
  //   ok: {
  //     description: 'The list of balances has been successefully received',
  //     type: GetBalancesResponse,
  //   },
  // },
  // getDepositAddress: {
  //   operation: {
  //     title: 'Get Deposit Address',
  //     description:
  //       "Addresses returned by this API are for personal use deposits and reuse the same personal address(es) in your wallet. Deposits to these addresses don't send IPNs. For commercial-use addresses and/or ones that send IPNs see 'get_callback_address'.",
  //   },
  //   ok: {
  //     description: 'The address has been successefully received or generated',
  //     type: GetDepositAddressResponse,
  //   },
  // },
  // getCallbackAddress: {
  //   operation: {
  //     title: 'Get Callback Address',
  //     description:
  //       "Returns fresh address to send funds and track it.  Since callback addresses are designed for commercial use they incur the same 0.5% fee on deposits as transactions created with 'create_transaction'. For personal use deposits that reuse the same personal address(es) in your wallet that have no fee but don't send IPNs see 'get_deposit_address'",
  //   },
  //   ok: {
  //     description:
  //       'Callback address has been successefully created and stored in database',
  //     type: CallbackAddressResponse,
  //   },
  // },
  // getTransactionsInfo: {
  //   operation: {
  //     title: 'Get Transactions Bulk Information',
  //     description:
  //       'Return transaction details. \nNote: If at all possible you should use the Instant Payment Notification (IPN) system to receive notifications about payments instead of using this polled interface.',
  //   },
  //   ok: {
  //     description: '',
  //   },
  // },

  // createTransfer: {
  //   operation: {
  //     title: 'Create Transfer',
  //   },
  //   ok: {
  //     type: CreateTransferResponse,
  //   },
  // },

  // createWithdrawal: {
  //   operation: {
  //     title: 'Create Withdrawal',
  //   },
  //   ok: {
  //     type: CreateWithdrawalResponse,
  //   },
  // },

  // createWithdrawalBulk: {
  //   operation: {
  //     title: 'Create Withdrawal Bulk Order',
  //   },
  //   ok: {
  //     isArray: true,
  //     type: CreateWithdrawalResponse,
  //   },
  // },

  // getWithdrawalHistory: {
  //   operation: {
  //     title: 'Get Withdrawal History',
  //     description: 'Returns paginated list of historical withdrawals',
  //   },
  //   ok: {
  //     isArray: true,
  //     type: WithdrawalInfoResponse,
  //   },
  // },

  // getWithdrawalInfo: {
  //   operation: {
  //     title: 'Get Withdrawal Information',
  //   },
  //   ok: {
  //     type: WithdrawalInfoResponse,
  //   },
  // },
};

function implicitBody<TRequest>(func: new () => TRequest) {
  return {
    name: 'Body',
    required: true,
    type: func,
  };
}

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}
  @Get('/test')
  async test() {
    return stringify({
      text: 'Привет мир и world! ®†',
      nested: {
        field: 5,
        array: [1, 'foo', { obj: 1 }],
      },
      num: 5,
    });
  }

  @Post('/notify')
  async notify(@Request() r: HttpRequest, @Body() body: any) {
    console.log('NOTIFICATION!!:');
    if (r.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawbody(r);
      const text = raw.toString().trim();
      const signature = crypto
        .createHmac('sha256', process.env.SECRET)
        .update(text)
        .digest('hex');

      const providedSignature = r.headers['signature'];
      if (providedSignature === signature) {
        return true;
      } else {
        throw new Error('incorrect signature');
      }
    } else {
      throw new Error('data isnt readable');
      // body is parsed by NestJS
      console.log('data:', body);
    }
    // console.log(r.originalUrl);
    // console.log((<any>r).rawBody);
    // console.log(r.body);
    // console.log(r.headers['hmac']);
    // const raw = JSON.stringify(body);
    // console.log(raw);
    // console.log(body);
    return true;
  }

  // Info
  @UseGuards(...(apiSchema.getBasicInfo.guards || defaultGuards))
  @ApiOperation(apiSchema.getBasicInfo.operation)
  @ApiOkResponse(apiSchema.getBasicInfo.ok)
  @ApiForbiddenResponse(apiSchema.getBasicInfo.forbidden || defaultForbidden)
  @ApiBadRequestResponse(apiSchema.getBasicInfo.badRequest || defaultBadRequest)
  @ApiImplicitHeaders(apiSchema.getBasicInfo.headers || defaultHeaders)
  @Post('/basic_info')
  async getBasicInfo(
    @Body() dto: GetBaseInfoRequest,
    @Request() r: HttpRequest,
  ): Promise<GetBasicInfoResponse> {
    return this.apiService.getInfo(dto, r);
  }

  @UseGuards(...(apiSchema.getNonce.guards || defaultGuards))
  @ApiOperation(apiSchema.getNonce.operation)
  @ApiOkResponse(apiSchema.getNonce.ok)
  @ApiForbiddenResponse(apiSchema.getNonce.forbidden || defaultForbidden)
  @ApiBadRequestResponse(apiSchema.getNonce.badRequest || defaultBadRequest)
  @ApiImplicitHeaders(apiSchema.getNonce.headers || defaultHeaders)
  @Post('/get_nonce')
  async getNonce(@Body() dto: GetNonceRequest, @Request() r: HttpRequest) {
    console.log('getting nonce');
    return this.apiService.getKeyNonce(dto, r);
  }

  @UseGuards(...(apiSchema.createTransaction.guards || defaultGuards))
  @ApiOperation(apiSchema.createTransaction.operation)
  @ApiOkResponse(apiSchema.createTransaction.ok)
  @ApiForbiddenResponse(
    apiSchema.createTransaction.forbidden || defaultForbidden,
  )
  @ApiBadRequestResponse(
    apiSchema.createTransaction.badRequest || defaultBadRequest,
  )
  @ApiImplicitHeaders(apiSchema.createTransaction.headers || defaultHeaders)
  @Post('/create_transaction')
  async createTransaction(
    @Body() dto: CreateTransactionRequest,
    @Request() r: HttpRequest,
  ): Promise<CreateTransactionResponse> {
    return this.apiService.createTransaction(dto, r);
  }

  @UseGuards(...(apiSchema.getTransactionInfo.guards || defaultGuards))
  @ApiOperation(apiSchema.getTransactionInfo.operation)
  @ApiOkResponse(apiSchema.getTransactionInfo.ok)
  @ApiForbiddenResponse(
    apiSchema.getTransactionInfo.forbidden || defaultForbidden,
  )
  @ApiBadRequestResponse(
    apiSchema.getTransactionInfo.badRequest || defaultBadRequest,
  )
  @ApiImplicitHeaders(apiSchema.getTransactionInfo.headers || defaultHeaders)
  @Post('/tx_info')
  async getTransactionInfo(
    @Body() dto: GetTransactionInfoRequest,
    @Request() r: HttpRequest,
  ): Promise<any> {
    return this.apiService.getTransaction(dto, r);
  }

  @UseGuards(...(apiSchema.getTransactionsList.guards || defaultGuards))
  @ApiOperation(apiSchema.getTransactionsList.operation)
  @ApiOkResponse(apiSchema.getTransactionsList.ok)
  @ApiForbiddenResponse(
    apiSchema.getTransactionsList.forbidden || defaultForbidden,
  )
  @ApiBadRequestResponse(
    apiSchema.getTransactionsList.badRequest || defaultBadRequest,
  )
  @ApiImplicitHeaders(apiSchema.getTransactionsList.headers || defaultHeaders)
  @Post('/txs')
  async getTransactionsList(
    @Body() dto: GetTransactionsListRequest,
    @Request() r: HttpRequest,
  ): Promise<any> {
    return this.apiService.getTransactionsList(dto, r);
  }

  // @UseGuards(...(apiSchema.getRates.guards || defaultGuards))
  // @ApiOperation(apiSchema.getRates.operation)
  // @ApiOkResponse(apiSchema.getRates.ok)
  // @ApiForbiddenResponse(apiSchema.getRates.forbidden || defaultForbidden)
  // @ApiBadRequestResponse(apiSchema.getRates.badRequest || defaultBadRequest)
  // @ApiImplicitHeaders(apiSchema.getRates.headers || defaultHeaders)
  //
  // @Post('/rates')
  // async getRates(@Body() dto: GetRatesRequest): Promise<GetRatesResponse> {
  //   return null;
  // }

  // @UseGuards(...(apiSchema.getBalances.guards || defaultGuards))
  // @ApiOperation(apiSchema.getBalances.operation)
  // @ApiOkResponse(apiSchema.getBalances.ok)
  // @ApiForbiddenResponse(apiSchema.getBalances.forbidden || defaultForbidden)
  // @ApiBadRequestResponse(apiSchema.getBalances.badRequest || defaultBadRequest)
  // @ApiImplicitHeaders(apiSchema.getBalances.headers || defaultHeaders)
  //
  // @Post('/balances')
  // async getBalances(
  //   @Body() dto: GetBalancesRequest,
  // ): Promise<GetBalancesResponse> {
  //   return null;
  // }

  // @ApiOperation(apiSchema.getDepositAddress.operation)
  // @ApiOkResponse(apiSchema.getDepositAddress.ok)
  // @ApiForbiddenResponse(
  //   apiSchema.getDepositAddress.forbidden || defaultForbidden,
  // )
  // @ApiBadRequestResponse(
  //   apiSchema.getDepositAddress.badRequest || defaultBadRequest,
  // )
  // @ApiImplicitHeaders(apiSchema.getDepositAddress.headers || defaultHeaders)
  //
  // @Post('/deposit_address')
  // async getDepositAddress(
  //   @Body() dto: GetDepositAddressRequest,
  // ): Promise<GetDepositAddressResponse> {
  //   return null;
  // }

  // @ApiOperation(apiSchema.getCallbackAddress.operation)
  // @ApiOkResponse(apiSchema.getCallbackAddress.ok)
  // @ApiForbiddenResponse(
  //   apiSchema.getCallbackAddress.forbidden || defaultForbidden,
  // )
  // @ApiBadRequestResponse(
  //   apiSchema.getCallbackAddress.badRequest || defaultBadRequest,
  // )
  // @ApiImplicitHeaders(apiSchema.getCallbackAddress.headers || defaultHeaders)
  //
  // @Post('/callback_address')
  // async getCallbackAddress(
  //   @Body() dto: CallbackAddressRequest,
  // ): Promise<CallbackAddressResponse> {
  //   return null;
  // }

  // @ApiOperation(apiSchema.getTransactionsInfo.operation)
  // @ApiOkResponse(apiSchema.getTransactionsInfo.ok)
  // @ApiForbiddenResponse(
  //   apiSchema.getTransactionsInfo.forbidden || defaultForbidden,
  // )
  // @ApiBadRequestResponse(
  //   apiSchema.getTransactionsInfo.badRequest || defaultBadRequest,
  // )
  // @ApiImplicitHeaders(apiSchema.getTransactionsInfo.headers || defaultHeaders)
  //
  // @Post('/txs_info')
  // async getTransactionsInfo(
  //   @Body() dto: GetTransactionsInfoRequest,
  // ): Promise<any> {
  //   return null;
  // }

  // // Send funds

  // @ApiOperation(apiSchema.createTransfer.operation)
  // @ApiOkResponse(apiSchema.createTransfer.ok)
  // @ApiForbiddenResponse(apiSchema.createTransfer.forbidden || defaultForbidden)
  // @ApiBadRequestResponse(
  //   apiSchema.createTransfer.badRequest || defaultBadRequest,
  // )
  // @ApiImplicitHeaders(apiSchema.createTransfer.headers || defaultHeaders)
  //
  // @Post('/create_transfer')
  // async createTransfer(
  //   @Body() dto: CreateTransferRequest,
  // ): Promise<CreateTransactionResponse> {
  //   return null;
  // }

  // @ApiOperation(apiSchema.createWithdrawal.operation)
  // @ApiOkResponse(apiSchema.createWithdrawal.ok)
  // @ApiForbiddenResponse(
  //   apiSchema.createWithdrawal.forbidden || defaultForbidden,
  // )
  // @ApiBadRequestResponse(
  //   apiSchema.createWithdrawal.badRequest || defaultBadRequest,
  // )
  // @ApiImplicitHeaders(apiSchema.createWithdrawal.headers || defaultHeaders)
  //
  // @Post('/create_withdrawal')
  // async createWithdrawal(
  //   @Body() dto: CreateWithdrawalRequest,
  // ): Promise<CreateWithdrawalResponse> {
  //   return null;
  // }

  // @ApiOperation(apiSchema.createWithdrawalBulk.operation)
  // @ApiOkResponse(apiSchema.createWithdrawalBulk.ok)
  // @ApiForbiddenResponse(
  //   apiSchema.createWithdrawalBulk.forbidden || defaultForbidden,
  // )
  // @ApiBadRequestResponse(
  //   apiSchema.createWithdrawalBulk.badRequest || defaultBadRequest,
  // )
  // @ApiImplicitHeaders(apiSchema.createWithdrawalBulk.headers || defaultHeaders)
  //
  // @Post('/create_withdrawals')
  // async createWithdrawalBulk(
  //   @Body() dto: CreateWithdrawalBulkRequest,
  // ): Promise<CreateWithdrawalResponse[]> {
  //   return null;
  // }

  // @ApiOperation(apiSchema.getWithdrawalHistory.operation)
  // @ApiOkResponse(apiSchema.getWithdrawalHistory.ok)
  // @ApiForbiddenResponse(
  //   apiSchema.getWithdrawalHistory.forbidden || defaultForbidden,
  // )
  // @ApiBadRequestResponse(
  //   apiSchema.getWithdrawalHistory.badRequest || defaultBadRequest,
  // )
  // @ApiImplicitHeaders(apiSchema.getWithdrawalHistory.headers || defaultHeaders)
  //
  // @Post('/withdrawal_history')
  // async getWithdrawalHistory(
  //   @Body() dto: GetWithdrawalHistoryRequest,
  // ): Promise<WithdrawalInfoResponse> {
  //   return null;
  // }

  // @ApiOperation(apiSchema.getWithdrawalInfo.operation)
  // @ApiOkResponse(apiSchema.getWithdrawalInfo.ok)
  // @ApiForbiddenResponse(
  //   apiSchema.getWithdrawalInfo.forbidden || defaultForbidden,
  // )
  // @ApiBadRequestResponse(
  //   apiSchema.getWithdrawalInfo.badRequest || defaultBadRequest,
  // )
  // @ApiImplicitHeaders(apiSchema.getWithdrawalInfo.headers || defaultHeaders)
  //
  // @Post('/withdrawal_info')
  // async getWithdrawalInfo(
  //   @Body() dto: GetWithdrawalInfoRequest,
  // ): Promise<WithdrawalInfoResponse[]> {
  //   return null;
  // }
}
