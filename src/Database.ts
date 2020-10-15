import { DatabaseCollection } from "./DatabaseCollection";
import { DatabaseSchema } from "./DatabaseSchema";

/**
 * This defines the implementation of a database.
 * It enumerates the methods that should be coded on client databases.
 * Any change here should reflect on all implementations.
 *
 * @author Rodrigo Portela
 */
export interface Database {
  getName(): string;
  getVersion(): number;
  getCollections(): Promise<DatabaseCollection<any>[]>;
  getCollection<T>(name: string): Promise<DatabaseCollection<T>>;
  drop(): Promise<unknown>;
  getSchema(): DatabaseSchema;
}
