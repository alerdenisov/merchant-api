import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ApiController } from 'api/api.controller';
import { ApiService } from 'api/api.service';
import { MerchantMiddleware } from 'merchants/merchant.middleware';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(MerchantMiddleware).forRoutes(ApiController);
  // }
}
