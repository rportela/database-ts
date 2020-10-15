import { DatabaseFilter } from "./DatabaseFilter";
import { DatabaseFilterExpression } from "./DatabaseFilterExpression";
import { DatabaseSortExpression } from "./DatabaseSortExpression";

export abstract class DatabaseQuery<T> {
  _filter?: DatabaseFilterExpression;
  _sort?: DatabaseSortExpression;
  _offset?: number;
  _limit?: number;

  where(filter: DatabaseFilter): DatabaseQuery<T> {
    return this.andWhere(filter);
  }

  andWhere(filter: DatabaseFilter): DatabaseQuery<T> {
    if (this._filter) {
      this._filter.and(filter);
    } else {
      this._filter = new DatabaseFilterExpression(filter);
    }
    return this;
  }

  orWhere(filter: DatabaseFilter): DatabaseQuery<T> {
    if (this._filter) {
      this._filter.or(filter);
    } else {
      this._filter = new DatabaseFilterExpression(filter);
    }
    return this;
  }

  thenOrderBy(descending: boolean, ...names: string[]) {
    if (this._sort) {
      this._sort.thenOrderBy(descending, ...names);
    } else {
      this._sort = new DatabaseSortExpression(descending, ...names);
    }
    return this;
  }

  orderBy(descending: boolean, ...names: string[]) {
    return this.thenOrderBy(descending, ...names);
  }

  offset(value: number): DatabaseQuery<T> {
    this._offset = value;
    return this;
  }

  limit(value: number): DatabaseQuery<T> {
    this._limit = value;
    return this;
  }
  /**
   * The actual execution of the database query.
   */
  abstract all(): Promise<T[]>;
  /**
   * 
   * @param fn 
   */
  filter(fn: (record: T) => boolean): Promise<T[]> {
    const records: T[] = [];
    return this.forEach((record) => {
      if (fn(record)) records.push(record);
    }).then(() => records);
  }
  /**
   * 
   * @param fn 
   */
  map<G>(fn: (record: T) => any): Promise<G[]> {
    const records: G[] = [];
    return this.forEach((record) => {
      records.push(fn(record));
    }).then(() => records);
  }
  /**
   * 
   * @param fn 
   */
  abstract forEach(fn: (record: T) => void): Promise<unknown>;
  /**
   * 
   */
  abstract count();
  /**
   * 
   */
  abstract first();
}
