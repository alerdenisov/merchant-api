import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { BlockchainEntity } from 'entities/blockchain.entity';
import { ManageService } from './manage.service';
import {
  ApiImplicitQuery,
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger';
import { ApiKeyEntity } from 'entities/api_keys.entity';

export class GetBlockchainsRequest {
  @ApiModelPropertyOptional({
    default: 0,
  })
  readonly currencies: number;
}

@Controller('manage')
export class ManageController {
  constructor(private readonly service: ManageService) {}

  @Get('/blockchains')
  public getBlockchains(): Promise<BlockchainEntity[]> {
    return this.service.getBlockchains();
  }
  @Get('/keys')
  public getKeys(): Promise<ApiKeyEntity[]> {
    return this.service.getKeys();
  }
}
