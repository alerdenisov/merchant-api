import { DynamicModule, Module, Injectable } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import {
  NotificationStatus,
  NotificationEntity,
  NotificationRepository,
} from 'entities/nofitication.entity';
import { InvoiceEntity, InvoiceRepository } from 'entities/invoice.entity';
import { ApiKeyEntity, ApiKeyRepository } from 'entities/api_keys.entity';
import * as request from 'request';
import * as crypto from 'crypto';

@Injectable()
export class NotificationDemon {
  constructor(
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {
    require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
    this.runCallbackJob();
  }

  async runCallbackJob() {
    console.log('-----check notifications------');
    const notifications = await this.notificationRepository
      .findPending('invoice')
      .getMany();

    console.log(`Found ${notifications.length} pending notifications`);
    for (let notification of notifications) {
      console.log(`Sending notification to ${notification.invoice.ipn}`);
      const body = JSON.stringify(notification);
      const signature = crypto
        .createHmac('sha256', process.env.SECRET)
        .update(body)
        .digest('hex');

      await new Promise((resolve, reject) =>
        request.post(
          notification.invoice.ipn,
          {
            strictSSL: false,
            body,
            headers: {
              signature,
            },
          },
          (err, response) => {
            if (err || ![200, 201].includes(response.statusCode)) {
              return reject({ err, response });
            }

            return resolve({ err, response });
          },
        ),
      )
        .then(({ err, response }) => {
          console.log('Notification done');
          return this.notificationRepository.update(
            {
              id: notification.id,
            },
            {
              status: NotificationStatus.Success,
            },
          );
        })
        .catch(({ err, response }) => {
          console.log('Notification failed');
          console.log(err, response.statusCode);

          return this.notificationRepository.update(
            {
              id: notification.id,
            },
            {
              tries: notification.tries + 1,
              status:
                notification.tries < 5
                  ? NotificationStatus.Pending
                  : NotificationStatus.Failed,
            },
          );
        });
    }
    setTimeout(() => this.runCallbackJob(), 1000);
    // export async function checkPendingNotifications() {
    //   const invoices = await Invoices.findPaidInvoices()
    //   for(let invoice of invoices) {
    //     if (!invoice.notified && invoice.callbacks) {
    //       request.post(invoice.callbacks.paid.url, {json:{token:invoice.callbacks.token,invoiceId:invoice._id,metadata:invoice.metadata}}, (err, resp) => {
    //         if (err || resp.statusCode != 200) {
    //           console.log(`invoice #${invoice._id}: callback error occured:`,err)
    //           return
    //         }
    //         Promise.resolve(Invoices.updateInvoice(invoice._id,{notified:Date.now(),state:'closed'}))
    //       })
    //     }
    //   }
    // }

    // export function runCallbackJob() {
    //   checkPendingNotifications()
    //   setInterval(checkPendingNotifications, 15000)
    // }
  }
}

@Module({
  providers: [NotificationDemon],
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      NotificationRepository,
      InvoiceEntity,
      InvoiceRepository,
      ApiKeyEntity,
      ApiKeyRepository,
    ]),
  ],
})
export class NotificationModule {}
