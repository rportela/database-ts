import {
  DatabaseCollection,
  DatabaseColumnSchema,
  DbKey,
} from "../DatabaseDefinition";
import {
  DatabaseEvent,
  DatabaseEventListener,
  DatabaseListeners,
} from "../DatabaseEvents";
import { DatabaseFilter } from "../DatabaseFilters";
import { DatabaseSortExpression } from "../DatabaseSorters";

export default class ObservableDbCollection<T>
  implements DatabaseCollection<T> {
  col: DatabaseCollection<T>;
  listeners: DatabaseListeners = new DatabaseListeners();

  constructor(col: DatabaseCollection<T>) {
    this.col = col;
  }

  private notifyAdd = (record: T, key: DbKey) => {
    this.listeners.notify(DatabaseEvent.DB_RECORD_ADD, {
      db: this.col.getDatabaseName(),
      collection: this.col.getName(),
      record: record,
      key: key,
    });
  };

  private notifyPut = (record: T, key: DbKey) => {
    this.listeners.notify(DatabaseEvent.DB_RECORD_PUT, {
      db: this.col.getDatabaseName(),
      collection: this.col.getName(),
      record: record,
      key: key,
    });
  };
  private notifyDel = (key: DbKey) => {
    this.listeners.notify(DatabaseEvent.DB_RECORD_DEL, {
      db: this.col.getDatabaseName(),
      collection: this.col.getName(),
      key: key,
    });
  };

  getDatabaseName(): string {
    return this.col.getDatabaseName();
  }
  getName(): string {
    return this.col.getName();
  }
  getPrimaryKey(): string | string[] {
    return this.col.getPrimaryKey();
  }
  getColumns(): DatabaseColumnSchema[] {
    return this.col.getColumns();
  }
  add(record: T): Promise<DbKey> {
    return this.col.add(record).then((key) => {
      this.notifyAdd(record, key);
      return key;
    });
  }
  addBatch(records: T[]): Promise<DbKey[]> {
    return this.col.addBatch(records).then((keys) => {
      for (let i = 0; i < keys.length; i++) {
        this.notifyAdd(records[i], keys[i]);
      }
      return keys;
    });
  }
  put(record: T): Promise<DbKey> {
    return this.col.put(record).then((key) => {
      this.notifyPut(record, key);
      return key;
    });
  }
  putBatch(records: T[]): Promise<DbKey[]> {
    return this.col.putBatch(records).then((keys) => {
      for (let i = 0; i < keys.length; i++) {
        this.notifyPut(records[i], keys[i]);
      }
      return keys;
    });
  }
  delete(key: DbKey): Promise<unknown> {
    return this.col.delete(key).then(() => {
      this.notifyDel(key);
      return key;
    });
  }
  get(key: DbKey): Promise<T> {
    return this.col.get(key);
  }
  all(): Promise<T[]> {
    return this.col.all();
  }
  filter(fn: (record: T) => boolean): Promise<T[]> {
    return this.col.filter(fn);
  }
  map<G>(fn: (record: T) => any): Promise<G[]> {
    return this.col.map(fn);
  }
  forEach(fn: (record: T) => void): Promise<unknown> {
    return this.col.forEach(fn);
  }
  count(): Promise<number> {
    return this.col.count();
  }
  query(
    filter: DatabaseFilter,
    sort?: DatabaseSortExpression,
    offset?: number,
    limit?: number
  ): Promise<T[]> {
    return this.col.query(filter, sort, offset, limit);
  }

  addListener(event: DatabaseEvent, listener: DatabaseEventListener) {
    this.listeners.addListener(event, listener);
  }

  removeListener(event: DatabaseEvent, listener: DatabaseEventListener) {
    this.listeners.removeListener(event, listener);
  }
}
