import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import { DatabaseService } from 'database/database.service';
import { Connection } from 'typeorm';
import { seed } from 'database/seed.service';

export class DatabaseModule {
  public static async forRoot(
    settings: Partial<TypeOrmModuleOptions>,
  ): Promise<DynamicModule> {
    const typeorm = TypeOrmModule.forRoot(
      Object.assign(
        {
          synchronize: true,
          logging: true,
        },
        settings,
      ),
    );

    // Seed db in dev mode
    if (process.env.NODE_ENV === 'development') {
      const seedConnection = await new Connection(<any>Object.assign(
        {
          synchronize: true,
          logging: true,
        },
        settings,
      )).connect();

      await seed(seedConnection);
    }

    console.log('dbinit');

    return {
      module: DatabaseModule,
      imports: [typeorm],
      components: [DatabaseService],
      exports: [DatabaseService],
    };
  }
}
