import { Module } from '@nestjs/common';
import { ApiController } from 'api/api.controller';
import { ApiService } from 'api/api.service';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
