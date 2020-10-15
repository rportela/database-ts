import { DatabaseCollection } from "../DatabaseCollection";
import { DatabaseCollectionSchema } from "../DatabaseCollectionSchema";
import { DatabaseColumnSchema } from "../DatabaseColumnSchema";
import { DatabaseKey } from "../DatabaseKey";
import { DatabaseQuery } from "../DatabaseQuery";

export default class IndexedDbCollection<T> implements DatabaseCollection<T> {
  private schema: DatabaseCollectionSchema;
  private db: IDBDatabase;
  private dbName: string;

  constructor(
    dbName: string,
    db: IDBDatabase,
    schema: DatabaseCollectionSchema
  ) {
    this.dbName = dbName;
    this.db = db;
    this.schema = schema;
  }
  getDatabaseName(): string {
    return this.dbName;
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
  add(record: T): Promise<DatabaseKey> {
    throw new Error("Method not implemented.");
  }
  addBatch(records: T[]): Promise<DatabaseKey[]> {
    throw new Error("Method not implemented.");
  }
  put(record: T): Promise<DatabaseKey> {
    throw new Error("Method not implemented.");
  }
  putBatch(records: T[]): Promise<DatabaseKey[]> {
    throw new Error("Method not implemented.");
  }
  delete(key: DatabaseKey): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  deleteBatch(keys: DatabaseKey[]): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  get(key: DatabaseKey): Promise<T> {
    throw new Error("Method not implemented.");
  }
  clear(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  drop(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  query(): DatabaseQuery<T> {
    throw new Error("Method not implemented.");
  }
}
