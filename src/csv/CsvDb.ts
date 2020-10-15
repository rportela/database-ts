import {
  Database,
  DatabaseCollection,
  DatabaseSchema,
} from "../DatabaseDefinition";

export default class CsvDb implements Database {

    

  getName(): string {
    throw new Error("Method not implemented.");
  }
  getVersion(): number {
    throw new Error("Method not implemented.");
  }
  getCollections(): Promise<DatabaseCollection<any>[]> {
    throw new Error("Method not implemented.");
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
}
