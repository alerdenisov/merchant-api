import { Connection } from 'typeorm';
import { BlockchainEntity } from 'entities/blockchain.entity';
import { Currency } from 'entities/currency.entity';
import bn from 'bignumber.js';

export abstract class BlockchainClient {
  constructor(
    protected readonly connection: Connection,
    protected readonly config: {
      currencies: string[];
      blockchain: BlockchainEntity;
    },
  ) {}

  abstract loadBalance(address: string, currency: Currency): Promise<bn>;
  abstract loadDeposit(txid: string): Promise<any>;
  abstract createAddress(options?: any): Promise<any>;
  abstract createWithdrawal(
    issuer: string,
    recipient: string,
    amount: string | number,
    options?: any,
  ): Promise<any>;
  abstract inspectAddress(address: string): Promise<any>;

  convertToBaseUnit(value: string | number | bn, currency: Currency): bn {
    const r = new bn(value).times(new bn(10).pow(currency.decimals));
    if (
      r
        .modulo(1)
        .integerValue()
        .eq(0)
    ) {
      throw new Error(
        `Failed to convert value to base (smallest) unit because it exceeds the maximum precision: ${value} - ${r.toString(
          10,
        )} must be equal to zero.`,
      );
    }

    return r.integerValue();
  }

  convertFromBaseUnit(value: bn | string | number, currency: Currency): bn {
    return new bn(value).div(new bn(10).pow(currency.decimals));
  }

  normalizeAddress(address: string) {
    return this.caseSensitive ? address : address.toLowerCase();
  }

  normalizeTxid(txid: string) {
    return this.caseSensitive ? txid : txid.toLowerCase();
  }

  get caseSensitive(): boolean {
    return false;
  }
}
