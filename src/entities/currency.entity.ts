import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { CallbackAddress } from './callback_address.entity';
import { ApiKey } from './api_keys.entity';

@Entity()
export class Currency {
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

  @Column('tinyint')
  blockchain: number;

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
}
