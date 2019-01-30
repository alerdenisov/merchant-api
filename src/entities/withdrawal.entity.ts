import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import { IsIn } from 'class-validator';

@Entity()
export class WithdrawalEntity {
  @PrimaryColumn()
  public id: string;

  @Index()
  @Column()
  public currency: string;

  @Index()
  @Column()
  public txid: string;

  @Column()
  public blockHeight: number;
}
