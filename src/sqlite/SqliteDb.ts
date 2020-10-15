import {
  Database,
  DatabaseCollection,
  DatabaseCollectionSchema,
  DatabaseSchema,
} from "../DatabaseDefinition";
import * as sqlite3 from "sqlite3";
import SqliteDbTable from "./SqliteDbTable";

export default class SqliteDb implements Database {
  private schema: DatabaseSchema;
  private db: sqlite3.Database;
  private collections: Promise<SqliteDbTable<any>[]>;
  constructor(fileName: string, schema: DatabaseSchema) {
    this.db = new sqlite3.Database(fileName);
    this.collections = Promise.resolve(
      schema.collections.map(this.createCollection)
    );
  }

  private createCollection = (
    col: DatabaseCollectionSchema
  ): SqliteDbTable<any> => {
    return new SqliteDbTable(this, col);
  };

  getName(): string {
    return this.schema.name;
  }
  getVersion(): number {
    return this.schema.version;
  }
  getCollections(): Promise<DatabaseCollection<any>[]> {
    return this.collections;
  }
  getCollection<T>(name: string): Promise<DatabaseCollection<T>> {
    return this.collections.then((cols) =>
      cols.find((col) => col.getName() === name)
    );
  }
  drop(): Promise<unknown> {
    throw new Error("Not yet implemented");
  }

  getSchema(): DatabaseSchema {
    return this.schema;
  }
}
