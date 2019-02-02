import { DynamicModule, Type, ForwardReference } from '@nestjs/common';
import { TypeOrmModule, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeormConfig } from 'typeorm-config';

export class ServiceModule {
  static forRoot(
    service:
      | Type<any>
      | DynamicModule
      | Promise<DynamicModule>
      | ForwardReference,
  ): DynamicModule {
    console.log(service);
    return {
      module: ServiceModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: TypeormConfig,
        }),
        service,
      ],
    };
  }
}
