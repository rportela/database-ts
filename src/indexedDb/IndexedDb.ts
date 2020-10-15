import { Database } from "../Database";
import { DatabaseCollection } from "../DatabaseCollection";
import { DatabaseSchema } from "../DatabaseSchema";
import IndexedDbCollection from "./IndexedDbCollection";

export default class IndexedDb implements Database {
  private schema: DatabaseSchema;
  private openDb: Promise<IDBDatabase>;
  private collections: Promise<IndexedDbCollection<any>[]>;

  private upgradeDatabase = (db: IDBDatabase, ev: IDBVersionChangeEvent) => {
    for (const name of db.objectStoreNames) db.deleteObjectStore(name);
    for (const col of this.schema.collections) {
      db.createObjectStore(col.name, {
        keyPath: col.primaryKey,
        autoIncrement: col.autoGenerated,
      });
    }
  };

  constructor(schema: DatabaseSchema) {
    this.schema = schema;
    this.openDb = new Promise((resolve, reject) => {
      const req = indexedDB.open(schema.name, schema.version);
      req.onblocked = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onupgradeneeded = (ev: IDBVersionChangeEvent) =>
        this.upgradeDatabase(req.result, ev);
    });
  }

  getDb(): Promise<IDBDatabase> {
    return this.openDb;
  }
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
    throw new Error("Method not implemented.");
  }
  drop(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  getSchema(): DatabaseSchema {
    throw new Error("Method not implemented.");
  }

  static drop(name: string) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(name);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
}
