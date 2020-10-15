import { DatabaseFilter } from "./DatabaseFilter";
import { DatabaseFilterComparison } from "./DatabaseFilterComparison";
import { DatabaseFilterType } from "./DatabaseFilterType";

/**
 * This represents the comparison of a single column or document attribute with a provided value.
 *
 * @author Rodrigo Portela
 */
export class DatabaseFilterTerm implements DatabaseFilter {
  name: string;
  comparison: DatabaseFilterComparison;
  value: any;
  constructor(name: string, comparison: DatabaseFilterComparison, value: any) {
    this.name = name;
    this.comparison = comparison;
    this.value = value;
  }
  createTest = () => {
    switch (this.comparison) {
      case DatabaseFilterComparison.EQUAL_TO:
        return (record: any) => record[this.name] === this.value;
      case DatabaseFilterComparison.NOT_EQUAL_TO:
        return (record: any) => record[this.name] !== this.value;
      case DatabaseFilterComparison.GREATER_THAN:
        return (record: any) => record[this.name] > this.value;
      case DatabaseFilterComparison.GREATER_OR_EQUAL:
        return (record: any) => record[this.name] >= this.value;
      case DatabaseFilterComparison.LOWER_THAN:
        return (record: any) => record[this.name] < this.value;
      case DatabaseFilterComparison.LOWER_OR_EQUAL:
        return (record: any) => record[this.name] <= this.value;
      case DatabaseFilterComparison.IN:
        return (record: any) => this.value.indexOf(record[this.name]) >= 0;
      case DatabaseFilterComparison.NOT_IN:
        return (record: any) => this.value.indexOf(record[this.name]) < 0;
      case DatabaseFilterComparison.LIKE:
        if (!(this.value instanceof RegExp))
          this.value = new RegExp(this.value, "ig");
        return (record: any) => (this.value as RegExp).test(record[this.name]);
      case DatabaseFilterComparison.NOT_LIKE:
        if (!(this.value instanceof RegExp))
          this.value = new RegExp(this.value, "ig");
        return (record: any) =>
          (this.value as RegExp).test(record[this.name]) === false;
      default:
        throw new Error("Unknown db filter comparison: " + this.comparison);
    }
  };
  getFilterType(): DatabaseFilterType {
    return DatabaseFilterType.TERM;
  }
}
