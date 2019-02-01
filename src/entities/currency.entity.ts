import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  EntityRepository,
} from 'typeorm';
import { BlockchainEntity } from 'entities/blockchain.entity';
import { InvoiceEntity } from 'entities/invoice.entity';
import { DepositAddressEntity } from 'entities/deposit-address.entity';
import { ExtendedRepository } from './extended-repository';

@Entity()
export class CurrencyEntity {
  // #  id                    :string(10)       not null, primary key
  // #  name                  :string(255)
  // #  blockchain_key        :string(32)
  // #  symbol                :string(1)        not null
  // #  type                  :string(30)       default("coin"), not null
  // #  deposit_fee           :decimal(32, 16)  default(0.0), not null
  // #  min_deposit_amount    :decimal(32, 16)  default(0.0), not null
  // #  min_collection_amount :decimal(32, 16)  default(0.0), not null
  // #  withdraw_fee          :decimal(32, 16)  default(0.0), not null
  // #  min_withdraw_amount   :decimal(32, 16)  default(0.0), not null
  // #  withdraw_limit_24h    :decimal(32, 16)  default(0.0), not null
  // #  withdraw_limit_72h    :decimal(32, 16)  default(0.0), not null
  // #  options               :string(1000)     default({}), not null
  // #  enabled               :boolean          default(TRUE), not null
  // #  base_factor           :integer          default(1), not null
  // #  precision             :integer          default(8), not null
  // #  icon_url              :string(255)
  // #  created_at            :datetime         not null
  // #  updated_at            :datetime         not null

  @PrimaryGeneratedColumn() id: number;

  @Index({
    unique: true,
  })
  @Column()
  symbol: string;

  @Column()
  name: string;

  @Column('tinyint')
  decimals: number;

  @Column('bool', { default: false })
  is_fiat: boolean;

  @Index()
  @ManyToOne(type => BlockchainEntity, blockchain => blockchain.currencies)
  blockchain: BlockchainEntity;

  @Column({ default: 0 })
  public rate_btc: number;

  @Column({ default: 0 })
  public rate_usd: number;

  @Column({ default: 0 })
  public rate_mnc: number;

  @CreateDateColumn()
  public create_at: Date;

  @UpdateDateColumn()
  public update_at: number;

  @Column({ default: 0 })
  public receive_fee: number;

  @Column({ default: 0 })
  public send_fee: number;

  @Column('tinyint', { default: 0 })
  public status: number; // 'online' | 'disabled' | 'maintaince';

  @Column()
  public confirms: number;

  @Index()
  @Column({ default: true })
  public capabilities_payments: boolean;

  @Index()
  @Column({ default: true })
  public capabilities_wallet: boolean;

  @Index()
  @Column({ default: true })
  public capabilities_transfers: boolean;

  @Index()
  @Column({ default: true })
  public capabilities_convert: boolean;

  @Column({ default: '{}' })
  public _meta: string;

  @OneToMany(type => InvoiceEntity, invoice => invoice.currency)
  invoices: InvoiceEntity[];

  @OneToMany(type => DepositAddressEntity, address => address.currency)
  addresses: DepositAddressEntity[];

  get meta(): { [key: string]: any } {
    return JSON.parse(this._meta);
  }

  set meta(value: { [key: string]: any }) {
    this._meta = JSON.stringify(value);
  }
}

@EntityRepository(CurrencyEntity)
export class CurrencyRepository extends ExtendedRepository<CurrencyEntity> {}
