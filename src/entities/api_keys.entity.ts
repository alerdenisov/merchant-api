import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { MerchantEntity } from 'entities/merchant.entity';

@Entity()
export class ApiKeyEntity {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => MerchantEntity, merchant => merchant.keys)
  merchant: MerchantEntity;

  @Index({
    unique: true,
  })
  @Column()
  public_key: string;

  @Index({
    unique: true,
  })
  @Column()
  private_key: string;

  @CreateDateColumn()
  create_at: Date;

  @Column('binary', { default: 0 })
  permissions: number;
}
