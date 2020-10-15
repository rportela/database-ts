import {
  DatabaseCollection,
  DatabaseCollectionSchema,
  DatabaseColumnSchema,
  DbKey,
} from "../DatabaseDefinition";
import { DatabaseFilter } from "../DatabaseFilters";
import { DatabaseSortExpression } from "../DatabaseSorters";
import SqliteDb from "./SqliteDb";

export default class SqliteDbTable<T> implements DatabaseCollection<T> {
  db: SqliteDb;
  schema: DatabaseCollectionSchema;

  constructor(db: SqliteDb, schema: DatabaseCollectionSchema) {
    this.db = db;
    this.schema = schema;
  }

  getDatabaseName(): string {
    return this.db.getName();
  }
  getName(): string {
    return this.schema.name;
  }
  getPrimaryKey(): string | string[] {
    return this.schema.primaryKey;
  }
  getColumns(): DatabaseColumnSchema[] {
    return this.schema.columns;
  }
  add(record: T): Promise<DbKey> {
    throw new Error("Method not implemented.");
  }
  addBatch(records: T[]): Promise<DbKey[]> {
    throw new Error("Method not implemented.");
  }
  put(record: T): Promise<DbKey> {
    throw new Error("Method not implemented.");
  }
  putBatch(records: T[]): Promise<DbKey[]> {
    throw new Error("Method not implemented.");
  }
  delete(key: DbKey): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  get(key: DbKey): Promise<T> {
    throw new Error("Method not implemented.");
  }
  all(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  filter(fn: (record: T) => boolean): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  map<G>(fn: (record: T) => any): Promise<G[]> {
    throw new Error("Method not implemented.");
  }
  forEach(fn: (record: T) => void): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  query(
    filter: DatabaseFilter,
    sort?: DatabaseSortExpression,
    offset?: number,
    limit?: number
  ): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
}
