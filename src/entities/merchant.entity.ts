import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { CallbackAddress } from 'entities/callback_address.entity';
import { ApiKey } from 'entities/api_keys.entity';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn() id: number;

  @Index({
    unique: true,
  })
  @Column()
  email: string;

  @Column()
  displayName: string;

  @Column('datetime')
  createdAt: Date;

  @OneToMany(type => CallbackAddress, address => address.merchant)
  callbacks: CallbackAddress[];

  @OneToMany(type => ApiKey, address => address.merchant)
  keys: ApiKey[];
}
