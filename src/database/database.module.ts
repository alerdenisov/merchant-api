import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { DynamicModule, Type } from '@nestjs/common';
import { DatabaseService } from 'database/database.service';
import { Connection } from 'typeorm';
import { seed } from 'database/seed.service';

export class DatabaseModule {
  public static async forRoot(
    func: Type<TypeOrmOptionsFactory>,
  ): Promise<DynamicModule> {
    // Seed db in dev mode
    if (process.env.NODE_ENV === 'development') {
      const seedConnection = await new Connection(<any>(
        new func().createTypeOrmOptions()
      )).connect();

      await seed(seedConnection);
    }

    return {
      module: DatabaseModule,
      components: [DatabaseService],
      exports: [DatabaseService],
    };
  }
}
