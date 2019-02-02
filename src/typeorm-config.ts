import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
export class TypeormConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions() {
    return Object.assign(
      {
        synchronize: true,
        logging: false,
      },
      {
        type: <any>process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      },
    );
  }
}
