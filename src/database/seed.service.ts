import { Connection } from 'typeorm';
import { seed as bc } from 'database/seeds/blockchains';
import { seed as cur } from 'database/seeds/currencies';

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
  await bc(connection);
  await cur(connection);
}
