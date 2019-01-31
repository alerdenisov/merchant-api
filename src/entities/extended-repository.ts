import { Repository, SelectQueryBuilder } from 'typeorm';

export abstract class ExtendedRepository<TEntity> extends Repository<TEntity> {
  populate(query: SelectQueryBuilder<TEntity>, fields: Array<keyof TEntity>) {
    for (let inject of fields) {
      query = this.join(query, inject, inject);
    }
    return query;
  }

  begin(): SelectQueryBuilder<TEntity> {
    return this.createQueryBuilder(this.metadata.name);
  }

  join(
    query: SelectQueryBuilder<TEntity>,
    left: keyof TEntity,
    right: keyof TEntity,
  ) {
    return query.leftJoinAndSelect(
      `${this.metadata.name}.${left}`,
      right.toString(),
    );
  }
}
