import { Controller, Post, Body } from '@nestjs/common';
import { ApiService } from './api.service';
import {
  GetRatesRequest,
  GetBalancesRequest,
  GetDepositAddress,
} from './dto/requests';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  // Info

  @Post('/basic_info')
  getBasicInfo() {
    return null;
  }

  @Post('/rates')
  getRates(@Body() dto: GetRatesRequest) {
    return null;
  }

  @Post('/balances')
  getBalances(@Body() dto: GetBalancesRequest) {
    return null;
  }

  @Post('/deposit_address')
  getDepositAddress(@Body() dto: GetDepositAddress) {
    return null;
  }

  // Receive payments

  @Post('/create_transaction')
  createTransaction() {
    return null;
  }

  @Post('/callback_address')
  getCallbackAddress() {
    return null;
  }

  @Post('/tx_info')
  getTransactionInfo() {
    return null;
  }

  @Post('/txs_info')
  getTransactionsInfo() {
    return null;
  }

  @Post('/txs')
  getTransactions() {}

  // Send funds
  @Post('/create_transfer')
  createTransfer() {
    return null;
  }

  @Post('/create_withdrawal')
  createWithdrawal() {
    return null;
  }

  @Post('/withdrawal_history')
  getWithdrawalHistory() {
    return null;
  }

  @Post('/withdrawal_info')
  getWithdrawalInfo() {
    return null;
  }
}
