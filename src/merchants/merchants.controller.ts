import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MerchantsService } from './merchants.service';

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
}
