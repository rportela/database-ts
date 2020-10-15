import { DatabaseQuery } from "../DatabaseQuery";
import { arraySlice } from "../utils/ArrayUtils";
import IndexedDbCollection from "./IndexedDbCollection";

export default class IndexedDbQuery<T> extends DatabaseQuery<T> {
  collection: IndexedDbCollection<T>;
  db: Promise<IDBDatabase>;
  constructor(db: Promise<IDBDatabase>, collection: IndexedDbCollection<T>) {
    super();
    this.db = db;
    this.collection = collection;
  }

  private getFiltered(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.then((db) => {
        const result: T[] = [];
        const test = this._filter.createTest();
        const req = db
          .transaction(this.collection.getName())
          .objectStore(this.collection.getName())
          .openCursor();
        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            const value = cursor.value;
            if (test(value)) result.push(value);
          } else {
            resolve(result);
          }
        };
        req.onerror = () => reject(req.error);
      });
    });
  }

  private getAll(): Promise<T[]> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.collection.getName())
            .objectStore(this.collection.getName())
            .getAll();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }

  all(): Promise<T[]> {
    return (this._filter ? this.getFiltered() : this.getAll()).then(
      (recs: T[]) => {
        if (this._sort) this._sort.sort(recs);
        return arraySlice(recs, this._offset, this._limit);
      }
    );
  }

  forEach(fn: (record: T) => void): Promise<unknown> {
    return this.all().then((recs) => recs.forEach(fn));
  }
  count() {
    return this.all().then((recs) => recs.length);
  }
  first() {
    return this.all().then((recs) => (recs.length > 0 ? recs[0] : undefined));
  }
}
