import {
  Database,
  DatabaseCollection,
  DatabaseSchema,
} from "../DatabaseDefinition";
import MemoryDbCollection from "./MemoryDbCollection";

export default class MemoryDb implements Database {
  private schema: DatabaseSchema;
  private collections: MemoryDbCollection<any>[];
  private all: any = {};
  constructor(schema: DatabaseSchema) {
    this.schema = schema;
    this.collections = this.schema.collections.map(
      (col) => new MemoryDbCollection(this, col)
    );
  }

  getAll<T>(collection: string): T[] {
    return this.all[collection];
  }

  getName(): string {
    return this.schema.name;
  }
  getVersion(): number {
    return this.schema.version;
  }
  getCollections(): Promise<DatabaseCollection<any>[]> {
    return Promise.resolve(this.collections);
  }
  getCollection<T>(name: string): Promise<DatabaseCollection<T>> {
    return Promise.resolve(
      this.collections.find((col) => col.getName() === name)
    );
  }
  drop(): Promise<unknown> {
    return Promise.resolve(delete this.all);
  }
  getSchema(): DatabaseSchema {
    return this.schema;
  }
}
