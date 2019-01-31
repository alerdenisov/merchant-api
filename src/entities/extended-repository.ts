import { Repository, SelectQueryBuilder } from 'typeorm';

export abstract class ExtendedRepository<TEntity> extends Repository<TEntity> {
  protected populate(
    query: SelectQueryBuilder<TEntity>,
    fields: Array<keyof TEntity>,
  ) {
    for (let inject of fields) {
      query = this.join(query, inject, inject);
    }
    return query;
  }

  protected begin(): SelectQueryBuilder<TEntity> {
    return this.createQueryBuilder(this.metadata.name);
  }

  protected join(
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
