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
} from './dto/requests';

type Response<T> = T | null | Error;

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  // Info

  @Post('/basic_info')
  async getBasicInfo(): Promise<Response<any>> {
    return null;
  }

  @Post('/rates')
  async getRates(@Body() dto: GetRatesRequest): Promise<Response<any>> {
    return null;
  }

  @Post('/balances')
  async getBalances(@Body() dto: GetBalancesRequest): Promise<Response<any>> {
    return null;
  }

  @Post('/deposit_address')
  async getDepositAddress(
    @Body() dto: GetDepositAddress,
  ): Promise<Response<any>> {
    return null;
  }

  // Receive payments

  @Post('/create_transaction')
  async createTransaction(
    @Body() dto: CreateTransactionRequest,
  ): Promise<Response<any>> {
    return null;
  }

  @Post('/callback_address')
  async getCallbackAddress(
    @Body() dto: CallbackAddressRequest,
  ): Promise<Response<any>> {
    return null;
  }

  @Post('/tx_info')
  async getTransactionInfo(
    @Body() dto: GetTransactionInfoRequest,
  ): Promise<Response<any>> {
    return null;
  }

  @Post('/txs_info')
  async getTransactionsInfo(
    @Body() dto: GetTransactionsInfoRequest,
  ): Promise<Response<any>> {
    return null;
  }

  @Post('/txs')
  async getTransactionsList(
    @Body() dto: GetTransactionsListRequest,
  ): Promise<Response<any>> {}

  // Send funds
  @Post('/create_transfer')
  async createTransfer(
    @Body() dto: CreateTransferRequest,
  ): Promise<Response<any>> {
    return null;
  }

  @Post('/create_withdrawal')
  async createWithdrawal(
    @Body() dto: CreateWithdrawalRequest,
  ): Promise<Response<any>> {
    return null;
  }
  @Post('/create_withdrawals')
  async createWithdrawalBulk(
    @Body() dto: CreateWithdrawalBulkRequest,
  ): Promise<Response<any>> {
    return null;
  }

  @Post('/withdrawal_history')
  async getWithdrawalHistory(
    @Body() dto: GetWithdrawalHistoryRequest,
  ): Promise<Response<any>> {
    return null;
  }

  @Post('/withdrawal_info')
  async getWithdrawalInfo(): Promise<Response<any>> {
    return null;
  }
}
