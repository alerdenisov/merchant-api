import { Entity, PrimaryColumn, Column } from 'typeorm';
import { IsIn } from 'class-validator';

@Entity()
export class DepositEntity {
  @PrimaryColumn()
  public id: string;

  @PrimaryColumn()
  public currency: string;

  @Column()
  public blockHeight: number;
}
