import { Injectable, Inject } from '@nestjs/common';
import { UpdateResult, Connection } from 'typeorm';
import {
  InvoiceEntity,
  InvoiceStatus,
  InvoiceRepository,
} from 'entities/invoice.entity';
import {
  NotificationEntity,
  NotificationStatus,
  NotificationRepository,
} from 'entities/nofitication.entity';
import { BlockchainClient } from 'blockchains/blockchain.client';
import { InjectRepository } from '@nestjs/typeorm';
import * as request from 'request';
import bn from 'bignumber.js';
import { BlockchainEntity } from 'entities/blockchain.entity';

@Injectable()
export class BlockchainDemon {
  private lastBlock: number;

  constructor(
    @InjectRepository(InvoiceRepository)
    private readonly invoiceRepository: InvoiceRepository,
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
    private readonly blockchain: BlockchainEntity,
    private readonly client: BlockchainClient,
    private readonly connection: Connection,
  ) {
    this.lastBlock = 0;
    this.waitForRun(() => {
      this.runLastBlockJob();
      // this.runCallbackJob();
    });
  }

  async waitForRun(func: () => void) {
    while (!this.client.ready) {
      console.log('wait for client');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('client is ready -------------------------');
    func();
  }

  async runLastBlockJob() {
    console.log('-----check chain------');
    try {
      const curBlock = await this.client.getBlockNumber(); //ethProvider.getBlockNumber();
      console.log(`block: ${curBlock} and known ${this.lastBlock}`);
      if (curBlock > this.lastBlock) {
        this.lastBlock = curBlock;
        await Promise.all(await this.checkPendingInvoices());
      }
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => this.runLastBlockJob(), 1000);
  }

  async checkPendingInvoices(): Promise<Promise<UpdateResult>[]> {
    const invoices = await this.invoiceRepository
      .findPending(this.blockchain, 'currency', 'depositAddress')
      .getMany();

    const curBlock = await this.client.getBlockNumber();
    const tasks = [];
    console.log(`checkPendingInvoices: found ${invoices.length} invoices`);
    for (let invoice of invoices) {
      const upd: Partial<InvoiceEntity> = {};

      if (invoice.status === InvoiceStatus.Pending) {
        // Pending payment
        const paid = new bn(
          await this.client.getBalance(
            invoice.currency,
            invoice.depositAddress,
          ),
        );

        const changed = !paid.eq(new bn(invoice.paid));

        if (changed) {
          upd.paid = paid.toString();
          if (paid.gte(new bn(invoice.total))) {
            upd.status = InvoiceStatus.Confirmating;
            upd.confirmation_block = curBlock + invoice.currency.confirms;
          }
        } else {
          const expire = invoice.expires
            ? invoice.expires.getTime()
            : invoice.created_at.getTime() + 20 * 1000; // 1 day

          console.log(
            `EXPIRE AT: ${expire} NOW: ${Date.now()} = ${expire - Date.now()}`,
          );
          if (Date.now() > expire) {
            upd.status = InvoiceStatus.Expired;
          }
        }
      } else {
        // Confirmating payment
        if (invoice.confirmation_block <= curBlock) {
          upd.status = InvoiceStatus.Paid;
        }
      }

      if (Object.keys(upd).length) {
        console.log(`updating invoice #${invoice.key}`, upd);
        await this.notificationRepository.notify(invoice);
        tasks.push(this.invoiceRepository.update({ key: invoice.key }, upd));
      }
    }
    return tasks;
  }
}
