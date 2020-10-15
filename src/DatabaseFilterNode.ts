import { DatabaseFilter } from "./DatabaseFilter";
import { DatabaseFilterComposition } from "./DatabaseFilterComposition";
import { DatabaseFilterType } from "./DatabaseFilterType";

/**
 * This is a part of an expression.
 * Basically the composition of two filters with a boolean operator.
 *
 * @author Rodrigo Portela
 */
export class DatabaseFilterNode implements DatabaseFilter {
  filter: DatabaseFilter;
  composition?: DatabaseFilterComposition;
  next?: DatabaseFilterNode;
  constructor(filter: DatabaseFilter) {
    this.filter = filter;
  }
  createTest = () => {
    if (this.next) {
      switch (this.composition) {
        case DatabaseFilterComposition.AND:
          const andL = this.filter.createTest();
          const andR = this.filter.createTest();
          return (record: any): boolean => andL(record) && andR(record);
        case DatabaseFilterComposition.OR:
          const orL = this.filter.createTest();
          const orR = this.filter.createTest();
          return (record: any): boolean => orL(record) && orR(record);
        default:
          throw new Error("Unknown filter composition: " + this.composition);
      }
    } else return this.filter.createTest();
  };
  getFilterType(): DatabaseFilterType {
    return DatabaseFilterType.NODE;
  }
}
