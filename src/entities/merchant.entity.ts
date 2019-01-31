import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ApiKeyEntity } from 'entities/api_keys.entity';
import { InvoiceEntity } from './invoice.entity';
import { DepositAddressEntity } from './deposit-address.entity';

@Entity()
export class MerchantEntity {
  @PrimaryGeneratedColumn() id: number;

  @Index({
    unique: true,
  })
  @Column()
  email: string;

  @Column()
  displayName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  ipn: string;

  @OneToMany(type => DepositAddressEntity, address => address.merchant)
  addresses: DepositAddressEntity[];

  @OneToMany(type => ApiKeyEntity, address => address.merchant)
  keys: ApiKeyEntity[];

  @OneToMany(type => InvoiceEntity, invoice => invoice.currency)
  invoices: InvoiceEntity[];
}
