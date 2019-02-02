import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { seed } from 'database/seed';

@Injectable()
export class DatabaseDaemon {
  /**
   * Initializes the database service
   * @param connection The connection, which gets injected
   */
  constructor(public connection: Connection) {
    console.log('sseeed database?');
    this.init();
  }

  async init() {
    if (process.env.NODE_ENV === 'development') {
      await seed(this.connection);
    }
  }

  /**
   * Returns the repository of the given entity
   * @param entity The database entity to get the repository from
   */
  async getRepository<T>(entity: any): Promise<Repository<T>> {
    return this.connection.getRepository(entity);
  }

  /**
   * Closes the current connection, if it is
   * connected
   */
  async closeConnection() {
    const connection = await this.connection;
    if (connection.isConnected) {
      await (await this.connection).close();
    }
  }
}
