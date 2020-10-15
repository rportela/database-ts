import { DatabaseColumnSchema } from "./DatabaseColumnSchema";
import { DatabaseKey } from "./DatabaseKey";
import { DatabaseQuery } from "./DatabaseQuery";

/**
 * This defines the implementation of a collection/table in a database.
 * It enumerates the methods that should be coded on client databases.
 * Any change here should reflect on all implementations.
 *
 * @author Rodrigo Portela
 */
export interface DatabaseCollection<T> {
  getDatabaseName(): string;
  getName(): string;
  getPrimaryKey(): string | string[];
  getColumns(): DatabaseColumnSchema[] | undefined;

  add(record: T): Promise<DatabaseKey>;
  addBatch(records: T[]): Promise<DatabaseKey[]>;

  put(record: T): Promise<DatabaseKey>;
  putBatch(records: T[]): Promise<DatabaseKey[]>;

  delete(key: DatabaseKey): Promise<unknown>;
  deleteBatch(keys: DatabaseKey[]): Promise<unknown>;

  get(key: DatabaseKey): Promise<T>;

  clear(): Promise<unknown>;
  drop(): Promise<unknown>;

  query(): DatabaseQuery<T>;
}
