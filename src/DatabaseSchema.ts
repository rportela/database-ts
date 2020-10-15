import { DatabaseCollectionSchema } from "./DatabaseCollectionSchema";

/**
 * This is the definition of a database.
 * The name, version and what collections it has.
 *
 * @author Rodrigo Portela
 */
export interface DatabaseSchema {
  name: string;
  collections: DatabaseCollectionSchema[];
  version?: number;
}
