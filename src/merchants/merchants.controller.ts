import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MerchantsService } from 'merchants/merchants.service';
import { InvoiceEntity } from 'entities/invoice.entity';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly service: MerchantsService) {
    console.log('merch sevice');
  }

  @MessagePattern({ service: 'merchant', cmd: 'findById' })
  findById(id: number) {
    console.log('call');
    return this.service.findById(id);
  }

  @MessagePattern({ service: 'merchant', cmd: 'createInvoice' })
  createInvoice(invoice: Partial<InvoiceEntity>) {
    return this.service.createInvoice(invoice);
  }

  @MessagePattern({ service: 'merchant', cmd: 'validateSignature' })
  validate({ signature, payload }: { signature: string; payload: Object }) {
    console.log(signature, payload);
    if (signature === 'MAGICSIG') return true;
    return false;
  }
}
