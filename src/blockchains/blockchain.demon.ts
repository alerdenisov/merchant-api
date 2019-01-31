import { Injectable, Inject } from '@nestjs/common';
import { UpdateResult, Connection } from 'typeorm';
import {
  InvoiceEntity,
  InvoiceStatus,
  InvoiceRepository,
} from 'entities/invoice.entity';
import { BlockchainClient } from 'blockchains/blockchain.client';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlockchainDemon {
  constructor(
    @InjectRepository(InvoiceRepository)
    private readonly invoiceRepository: InvoiceRepository,
    private readonly client: BlockchainClient,
    private readonly connection: Connection,
  ) {
    this.waitForRun(() => {
      this.runLastBlockJob();
      this.runCallbackJob();
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

  runCallbackJob(): any {}

  runLastBlockJob(): any {
    let curBlock: number = 0;
    let lastBlock: number = 0;
    const updateLastBlock = async () => {
      console.log('--------------------');
      console.log('--------------------');
      console.log('--------------------');
      console.log('-----run chain------');
      try {
        curBlock = await this.client.getBlockNumber(); //ethProvider.getBlockNumber();
        if (curBlock > lastBlock) {
          lastBlock = this.client.blockNumber;
          await Promise.all(await this.checkPendingInvoices());
        }
      } catch (e) {
        console.log(e);
      }
      setTimeout(updateLastBlock, 5000);
    };
    updateLastBlock();
  }

  async checkPendingInvoices(): Promise<Promise<UpdateResult>[]> {
    const invoices = await this.invoiceRepository
      .findPending('currency')
      .getMany();

    const curBlock = await this.client.getBlockNumber();
    const tasks = [];
    console.log(`checkPendingInvoices: found ${invoices.length} invoices`);
    for (let invoice of invoices) {
      const balance = await this.client.getBalance(
        invoice.currency,
        invoice.depositAddress,
      );

      const upd: Partial<InvoiceEntity> = {};
      upd.paid = balance.toNumber();

      const expires =
        invoice.expires || new Date().setDate(invoice.created_at.getDate() + 1); // 1 day
      if (Date.now() > expires) {
        upd.status = InvoiceStatus.Expired;
      }
      if (balance.gte(invoice.total)) {
        if (invoice.currency.confirms > 0) {
          if (invoice.confirmation_block) {
            if (curBlock >= invoice.confirmation_block) {
              upd.status = InvoiceStatus.Paid;
            }
          } else {
            upd.status = InvoiceStatus.Confirmating;
            upd.confirmation_block = curBlock + invoice.currency.confirms;
          }
        } else {
          upd.status = InvoiceStatus.Paid;
        }
      }

      if (Object.keys(upd).length) {
        console.log(`updating invoice #${invoice.key}`, upd);
        tasks.push(this.invoiceRepository.update({ key: invoice.key }, upd));
      }
    }
    return tasks;
  }
}
