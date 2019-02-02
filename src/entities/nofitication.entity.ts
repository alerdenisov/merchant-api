import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  EntityRepository,
  Repository,
  In,
  SelectQueryBuilder,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IsIn } from 'class-validator';
import { ExtendedRepository } from 'entities/extended-repository';
import { InvoiceEntity } from 'entities/invoice.entity';

export enum NotificationStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => InvoiceEntity, invoice => invoice.notifications)
  invoice: InvoiceEntity;

  @Index()
  @Column('enum', {
    enum: NotificationStatus,
    default: NotificationStatus.Pending,
  })
  status: NotificationStatus;

  @Column('tinyint', { default: 0 })
  tries: number;
}

@EntityRepository(NotificationEntity)
export class NotificationRepository extends ExtendedRepository<
  NotificationEntity
> {
  async notify(invoice: InvoiceEntity) {
    const notification = this.create();
    notification.invoice = invoice;
    notification.status = NotificationStatus.Pending;

    console.log(`create notification:`);
    console.log(notification);
    return this.save(notification);
  }

  findPending(...populate: Array<keyof NotificationEntity>) {
    let query = this.begin().where({
      status: NotificationStatus.Pending,
    });

    return this.populate(query, populate);
  }
}
