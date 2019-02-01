import { Injectable } from '@nestjs/common';
import { GetBaseInfoRequest } from './dto/requests';
import { Request } from 'express';
import * as joi from 'joi';

@Injectable()
export class ApiService {
  getInfo(dto: GetBaseInfoRequest, r: Request): any {
    return (<any>r).merchant;
  }

  getKeyNonce(dto: GetBaseInfoRequest, r: Request): any {
    const { merchantKey } = <any>r;
    return joi.validate(
      merchantKey,
      {
        public_key: joi
          .string()
          .required()
          .length(40),
        nonce: joi.number().required(),
      },
      { stripUnknown: true },
    );
  }
}
