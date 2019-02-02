import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  EntityRepository,
  Repository,
  In,
  SelectQueryBuilder,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { IsIn, IsNumberString } from 'class-validator';
import { CurrencyEntity } from 'entities/currency.entity';
import { MerchantEntity } from 'entities/merchant.entity';
import { DepositAddressEntity } from 'entities/deposit-address.entity';
import { NotificationEntity } from 'entities/nofitication.entity';
import { ExtendedRepository } from 'entities/extended-repository';
import { BlockchainEntity } from './blockchain.entity';

export enum InvoiceStatus {
  Created = 'created',
  Pending = 'pending',
  Confirmating = 'confirmating',
  Expired = 'expired',
  Paid = 'paid',
}

@Entity()
export class InvoiceEntity {
  @Index({
    unique: true,
  })
  @PrimaryColumn()
  key: string;

  @ManyToOne(type => CurrencyEntity, currency => currency.invoices)
  currency: CurrencyEntity;

  @ManyToOne(type => BlockchainEntity, chain => chain.invoices)
  blockchain: BlockchainEntity;

  @ManyToOne(type => MerchantEntity, merchant => merchant.invoices)
  merchant: MerchantEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime')
  expires: Date;

  @Column({ nullable: true })
  ipn: string;

  @OneToMany(type => NotificationEntity, notification => notification.invoice)
  notifications: NotificationEntity[];

  @OneToOne(type => DepositAddressEntity, deposit => deposit.invoice)
  @JoinColumn()
  depositAddress: DepositAddressEntity;

  @Index()
  @Column('enum', { enum: InvoiceStatus, default: InvoiceStatus.Pending })
  status: InvoiceStatus;

  @Column()
  @IsNumberString()
  total: string;

  @Column({ default: '0' })
  paid: string;

  @Column({ default: 0 })
  confirmation_block: number;
}

@EntityRepository(InvoiceEntity)
export class InvoiceRepository extends ExtendedRepository<InvoiceEntity> {
  getList(
    merchant: MerchantEntity,
    start: number,
    limit: number,
    newer: number,
    ...populate: Array<keyof InvoiceEntity>
  ) {
    console.log(merchant);
    return this.populate(
      this.begin()
        .where({
          merchant,
          status: In([InvoiceStatus.Pending, InvoiceStatus.Confirmating]),
        })
        .orderBy(this.metadata.name + '.created_at')
        .skip(start)
        .limit(limit),
      populate,
    );
  }

  findPending(
    chain: BlockchainEntity,
    ...populate: Array<keyof InvoiceEntity>
  ) {
    let query = this.begin().where({
      blockchain: chain,
      status: In([InvoiceStatus.Pending, InvoiceStatus.Confirmating]),
    });

    return this.populate(query, populate);
  }
}
