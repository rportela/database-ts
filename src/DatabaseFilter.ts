import { DatabaseFilterType } from "./DatabaseFilterType";

/**
 * This represents the general shape of a database filter so you can further query and decode them.
 *
 * @author Rodrigo Portela
 */
export interface DatabaseFilter {
  createTest: () => (record: any) => boolean;
  getFilterType(): DatabaseFilterType;
}
