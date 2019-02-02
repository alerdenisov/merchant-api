import { Connection } from 'typeorm';
import { blockchains, currencies, merchants } from 'database/seeds';

function clearDb(connection: Connection) {
  return connection.transaction(async em => {
    em.query('SET FOREIGN_KEY_CHECKS = 0;');
    connection.entityMetadatas.forEach(table =>
      em.query(`TRUNCATE table ${table.tableName}`),
    );
    em.query('SET FOREIGN_KEY_CHECKS = 1;');
  });
}

export async function seed(connection: Connection) {
  await clearDb(connection);
  // const transaction = connection.transaction(async em => {
  await blockchains(connection);
  await currencies(connection);
  await merchants(connection);
  // });
}
