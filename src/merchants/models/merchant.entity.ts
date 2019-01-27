import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

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
}
