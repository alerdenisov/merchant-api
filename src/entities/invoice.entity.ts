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
} from 'typeorm';
import { IsIn } from 'class-validator';
import { CurrencyEntity } from 'entities/currency.entity';
import { MerchantEntity } from './merchant.entity';
import { DepositAddressEntity } from './deposit-address.entity';
import { ExtendedRepository } from './extended-repository';

export enum InvoiceStatus {
  Created = 'created',
  Expired = 'expired',
  Pending = 'pending',
  Confirmating = 'confirmating',
  Paid = 'paid',
}

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => InvoiceEntity, invoice => invoice.notifications)
  invoice: InvoiceEntity;

  @Index()
  @Column({ default: 0 })
  status: number;

  @Column('tinyint')
  tries: number;

  @Column()
  ipn: string;

  @Column()
  payload: string;
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

  @ManyToOne(type => MerchantEntity, merchant => merchant.invoices)
  merchant: MerchantEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { nullable: true })
  expires: Date;

  @Column({ nullable: true })
  ipn: string;

  @OneToMany(type => NotificationEntity, notification => notification.invoice)
  notifications: NotificationEntity[];

  @OneToOne(type => DepositAddressEntity, deposit => deposit.invoice)
  depositAddress: DepositAddressEntity;

  @Column('enum', { enum: InvoiceStatus })
  status: InvoiceStatus;

  @Column()
  total: number;

  @Column()
  confirmation_block: number;

  @Column({ default: 0 })
  paid: number;
}

@EntityRepository(InvoiceEntity)
export class InvoiceRepository extends ExtendedRepository<InvoiceEntity> {
  findPending(...populate: Array<keyof InvoiceEntity>) {
    let query = this.begin().where({
      status: In([InvoiceStatus.Pending, InvoiceStatus.Confirmating]),
    });

    return this.populate(query, populate);
  }
}
