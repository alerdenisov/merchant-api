import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import { DatabaseService } from './database.service';

export class DatabaseModule {
  public static forRoot(
    settings: Partial<TypeOrmModuleOptions>,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot(
          Object.assign(
            {
              synchronize: true,
              logging: true,
            },
            settings,
          ),
        ),
      ],
      components: [DatabaseService],
      exports: [DatabaseService],
    };
  }
}
