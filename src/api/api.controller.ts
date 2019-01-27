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
} from '@nestjs/swagger';
import { GetBasicInfoResponse } from './dto/responses';
import { AuthenticationError, ValidationApiError } from './dto/errors';

type Response<T> = Promise<T>;

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  // Info

  @ApiOperation({
    title: 'Get basic account information',
    description:
      'Returns object with identification string and private data setupped in admin panel',
  })
  @ApiOkResponse({
    description: 'The bacis information has been successefully received',
    type: GetBasicInfoResponse,
  })
  @ApiForbiddenResponse({ description: 'Forbinned', type: AuthenticationError })
  @ApiBadRequestResponse({
    description: 'Call has been reject while processing',
    type: ValidationApiError,
  })
  @ApiImplicitHeader({
    name: 'HMAC',
    description: 'Payload signature based on merchant secret phrase',
  })
  @Post('/basic_info')
  async getBasicInfo(
    @Body() dto: GetBaseInfoRequest,
  ): Response<GetBasicInfoResponse> {
    return null;
  }

  @Post('/rates')
  async getRates(@Body() dto: GetRatesRequest): Response<any> {
    return null;
  }

  @Post('/balances')
  async getBalances(@Body() dto: GetBalancesRequest): Response<any> {
    return null;
  }

  @Post('/deposit_address')
  async getDepositAddress(@Body() dto: GetDepositAddress): Response<any> {
    return null;
  }

  // Receive payments

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
