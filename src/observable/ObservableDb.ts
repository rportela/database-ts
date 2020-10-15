import { Database, DatabaseSchema } from "../DatabaseDefinition";
import ObservableDbCollection from "./ObservableDbCollection";

export default class ObservableDb implements Database {
  db: Database;
  collections: Promise<ObservableDbCollection<any>[]>;

  constructor(db: Database) {
    this.db = db;
    this.collections = db
      .getCollections()
      .then((cols) => cols.map((col) => new ObservableDbCollection(col)));
  }

  getName(): string {
    return this.db.getName();
  }
  getVersion(): number {
    return this.db.getVersion();
  }
  getCollections(): Promise<ObservableDbCollection<any>[]> {
    return this.collections;
  }
  getCollection<T>(name: string): Promise<ObservableDbCollection<T>> {
    return this.collections.then((cols) =>
      cols.find((col) => col.getName() === name)
    );
  }
  drop(): Promise<unknown> {
    return this.db.drop();
  }
  getSchema(): DatabaseSchema {
    return this.db.getSchema();
  }
}
