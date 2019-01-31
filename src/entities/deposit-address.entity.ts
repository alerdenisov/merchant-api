import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BlockchainEntity } from './blockchain.entity';
import { CurrencyEntity } from './currency.entity';
import { MerchantEntity } from './merchant.entity';
import { InvoiceEntity } from './invoice.entity';

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
