import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  EntityRepository,
} from 'typeorm';
import { BlockchainEntity } from './blockchain.entity';
import { CurrencyEntity } from './currency.entity';
import { MerchantEntity } from './merchant.entity';
import { InvoiceEntity } from './invoice.entity';
import { ExtendedRepository } from './extended-repository';
import { ethers } from 'ethers';

@Entity()
export class DepositAddressEntity {
  @PrimaryGeneratedColumn() id: number;

  @Index({
    unique: true,
  })
  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  privateKey: string;

  @ManyToOne(type => BlockchainEntity, chain => chain.addresses)
  blockchain: BlockchainEntity;

  @ManyToOne(type => CurrencyEntity, currency => currency.addresses)
  currency: CurrencyEntity;

  @ManyToOne(type => MerchantEntity, merchant => merchant.addresses)
  merchant: MerchantEntity;

  @OneToOne(type => InvoiceEntity, invoice => invoice.depositAddress)
  invoice: InvoiceEntity;

  @Column({ default: 0.01 })
  fee: number;
}

@EntityRepository(DepositAddressEntity)
export class DepositAddressRepository extends ExtendedRepository<
  DepositAddressEntity
> {
  createRandom(currency: CurrencyEntity, merchant: MerchantEntity) {
    const wallet = ethers.Wallet.createRandom();
    const deposit = this.create();

    deposit.privateKey = wallet.privateKey;
    deposit.address = wallet.address;
    deposit.currency = currency;
    deposit.merchant = merchant;

    return this.save(deposit);
  }
}
