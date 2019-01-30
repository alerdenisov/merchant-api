import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Currency } from 'entities/currency.entity';

export enum BlockchainStatus {
  Online = 0,
  Maintaince = 1,
  Disabled = 2,
}

@Entity()
export class BlockchainEntity {
  // schema
  // id                   :integer          not null, primary key
  // key                  :string(255)      not null
  // name                 :string(255)
  // client               :string(255)      not null
  // server               :string(255)
  // height               :integer          not null
  // explorer_address     :string(255)
  // explorer_transaction :string(255)
  // min_confirmations    :integer          default(6), not null
  // status               :string(255)      not null
  // created_at           :datetime         not null
  // updated_at           :datetime         not null

  @PrimaryGeneratedColumn()
  public id: number;

  @Index({ unique: true })
  @Column('varchar', { length: 80 })
  public key: string;

  @Column('varchar', { length: 80 })
  public name: string;

  @Column('varchar', { length: 80 })
  public client: string;

  @Column('varchar', { length: 80 })
  public server: string;

  @Column('int', { default: 0 })
  public height: number;

  @Column('tinyint', { default: 1 })
  public min_confirmations: number;

  @Column('enum', {
    enum: BlockchainStatus,
    default: BlockchainStatus.Online,
  })
  public status: BlockchainStatus;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

  @OneToMany(type => Currency, coin => coin.blockchain)
  currencies: Currency[];
}
