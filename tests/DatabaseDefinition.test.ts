import { DatabaseSchema } from "../src/DatabaseDefinition";
import MemoryDb from "../src/memorydb/MemoryDb";

function testCreateSchema() {
  let schema: DatabaseSchema = {
    name: "TestSchema",
    version: 1,
    collections: [{ name: "testCollection", primaryKey: "id" }],
  };
  let db: MemoryDb = new MemoryDb(schema);
  expect(db.getName()).toBe(schema.name);
  expect(db.getSchema()).toBe(schema);
  expect(db.getVersion()).toBe(schema.version);
}

function testDatabaseDefinition() {
  it("Creates Schema", testCreateSchema);
}

describe("Database Definition Test", testDatabaseDefinition);
