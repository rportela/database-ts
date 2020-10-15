/**
 * This class joins two filters.
 * It combines a column or attribute name with a direction to sort.
 * Optionally indicates the next sort node.
 * You should use this convention to decode to a database dialect.
 * The naive implementation is included.
 *
 * @author Rodrigo Portela
 */
export class DatabaseSortNode {
  name: string;
  descending?: boolean;
  next?: DatabaseSortNode;

  constructor(name: string, descending?: boolean) {
    this.name = name;
    this.descending = descending;
  }

  createAscendingComparer = (a: any, b: any): number => {
    const left = a[this.name];
    const right = b[this.name];
    if (left < right) return -1;
    if (left === right) return 0;
    else return 1;
  };

  createDescendingComparer = (a: any, b: any) => {
    const left = a[this.name];
    const right = b[this.name];
    if (left > right) return -1;
    if (left === right) return 0;
    else return 1;
  };

  createComparer(): (a: any, b: any) => number {
    return this.descending === true
      ? this.createDescendingComparer
      : this.createAscendingComparer;
  }
}
