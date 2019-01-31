import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
  EntityRepository,
} from 'typeorm';
import { MerchantEntity } from 'entities/merchant.entity';
import { ExtendedRepository } from './extended-repository';

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

@EntityRepository(ApiKeyEntity)
export class ApiKeyRepository extends ExtendedRepository<ApiKeyEntity> {
  findByPublic(public_key: string, ...populate: Array<keyof ApiKeyEntity>) {
    return this.populate(
      this.begin().where({
        public_key,
      }),
      populate,
    );
  }
}
