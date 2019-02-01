import { SignedRequestGuard } from 'merchants/signed-request.guard';
import { UseGuards, Controller, Post } from '@nestjs/common';

@UseGuards(SignedRequestGuard)
@Controller('api')
export class ApiController {
  @Post('/invoice')
  createInvoice() {}
}
