import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Merchant } from './merchant.entity';

@Entity()
export class CallbackAddress {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => Merchant, merchant => merchant.callbacks)
  merchant: Merchant;

  @Index({
    unique: true,
  })
  @Column()
  email: string;

  @Column()
  displayName: string;

  @Column('datetime')
  createdAt: Date;
}
