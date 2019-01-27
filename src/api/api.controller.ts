import { Controller, Post, Body } from '@nestjs/common';
import { ApiService } from './api.service';
import {
  GetRatesRequest,
  GetBalancesRequest,
  GetDepositAddress,
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
} from './dto/requests';
import {
  ApiResponse,
  ApiOkResponse,
  ApiOperation,
  ApiForbiddenResponse,
  ApiImplicitHeader,
  ApiBadRequestResponse,
  ResponseMetadata,
  ApiImplicitHeaders,
} from '@nestjs/swagger';
import {
  GetBasicInfoResponse,
  GetRatesResponse,
  GetBalancesResponse,
  GetDepositAddressResponse,
  CreateTransactionResponse,
} from './dto/responses';
import { AuthenticationError, ValidationApiError } from './dto/errors';

type Response<T> = Promise<T>;

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
  getRates: {
    operation: {
      title: 'Convertion Rates / Coin List',
      description: 'Returns convertion rates and supported coins list',
    },
    ok: {
      description: 'The list of coin has been successefully received',
      type: GetRatesResponse,
    },
  },
  getBalances: {
    operation: {
      title: 'Coins Balances',
      description: 'Returns list of available balances',
    },
    ok: {
      description: 'The list of balances has been successefully received',
      type: GetBalancesResponse,
    },
  },
  getDepositAddress: {
    operation: {
      title: 'Get Deposit Address',
      description:
        "Addresses returned by this API are for personal use deposits and reuse the same personal address(es) in your wallet. Deposits to these addresses don't send IPNs. For commercial-use addresses and/or ones that send IPNs see 'get_callback_address'.",
    },
    ok: {
      description: 'The address has been successefully received or generated',
      type: GetDepositAddressResponse,
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
};

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  // Info
  @ApiOperation(apiSchema.getBasicInfo.operation)
  @ApiOkResponse(apiSchema.getBasicInfo.ok)
  @ApiForbiddenResponse(apiSchema.getBasicInfo.forbidden || defaultForbidden)
  @ApiBadRequestResponse(apiSchema.getBasicInfo.badRequest || defaultBadRequest)
  @ApiImplicitHeaders(apiSchema.getBasicInfo.headers || defaultHeaders)
  @Post('/basic_info')
  async getBasicInfo(
    @Body() dto: GetBaseInfoRequest,
  ): Response<GetBasicInfoResponse> {
    return null;
  }

  @ApiOperation(apiSchema.getRates.operation)
  @ApiOkResponse(apiSchema.getRates.ok)
  @ApiForbiddenResponse(apiSchema.getRates.forbidden || defaultForbidden)
  @ApiBadRequestResponse(apiSchema.getRates.badRequest || defaultBadRequest)
  @ApiImplicitHeaders(apiSchema.getRates.headers || defaultHeaders)
  @Post('/rates')
  async getRates(@Body() dto: GetRatesRequest): Response<any> {
    return null;
  }

  @ApiOperation(apiSchema.getBalances.operation)
  @ApiOkResponse(apiSchema.getBalances.ok)
  @ApiForbiddenResponse(apiSchema.getBalances.forbidden || defaultForbidden)
  @ApiBadRequestResponse(apiSchema.getBalances.badRequest || defaultBadRequest)
  @ApiImplicitHeaders(apiSchema.getBalances.headers || defaultHeaders)
  @Post('/balances')
  async getBalances(@Body() dto: GetBalancesRequest): Response<any> {
    return null;
  }

  @ApiOperation(apiSchema.getDepositAddress.operation)
  @ApiOkResponse(apiSchema.getDepositAddress.ok)
  @ApiForbiddenResponse(
    apiSchema.getDepositAddress.forbidden || defaultForbidden,
  )
  @ApiBadRequestResponse(
    apiSchema.getDepositAddress.badRequest || defaultBadRequest,
  )
  @ApiImplicitHeaders(apiSchema.getDepositAddress.headers || defaultHeaders)
  @Post('/deposit_address')
  async getDepositAddress(@Body() dto: GetDepositAddress): Response<any> {
    return null;
  }

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
  ): Response<any> {
    return null;
  }

  @Post('/callback_address')
  async getCallbackAddress(@Body() dto: CallbackAddressRequest): Response<any> {
    return null;
  }

  @Post('/tx_info')
  async getTransactionInfo(
    @Body() dto: GetTransactionInfoRequest,
  ): Response<any> {
    return null;
  }

  @Post('/txs_info')
  async getTransactionsInfo(
    @Body() dto: GetTransactionsInfoRequest,
  ): Response<any> {
    return null;
  }

  @Post('/txs')
  async getTransactionsList(
    @Body() dto: GetTransactionsListRequest,
  ): Response<any> {}

  // Send funds
  @Post('/create_transfer')
  async createTransfer(@Body() dto: CreateTransferRequest): Response<any> {
    return null;
  }

  @Post('/create_withdrawal')
  async createWithdrawal(@Body() dto: CreateWithdrawalRequest): Response<any> {
    return null;
  }
  @Post('/create_withdrawals')
  async createWithdrawalBulk(
    @Body() dto: CreateWithdrawalBulkRequest,
  ): Response<any> {
    return null;
  }

  @Post('/withdrawal_history')
  async getWithdrawalHistory(
    @Body() dto: GetWithdrawalHistoryRequest,
  ): Response<any> {
    return null;
  }

  @Post('/withdrawal_info')
  async getWithdrawalInfo(
    @Body() dto: GetWithdrawalInfoRequest,
  ): Response<any> {
    return null;
  }
}
