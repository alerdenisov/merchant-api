import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Merchant } from './merchant.entity';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => Merchant, merchant => merchant.keys)
  merchant: Merchant;

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
  @Column()
  create_at: Date;

  @Column('binary')
  permissions: number;
}
