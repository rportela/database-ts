import { DatabaseSortNode } from "./DatabaseSortNode";

/**
 * This is a joined sort expression that performs sequential sorts based on the nodes.
 * You should use this description to create a sort expression on a database or on a set of records.
 * The javascript sort implementation is included.
 *
 * @author Rodrigo Portela
 */
export class DatabaseSortExpression {
  first: DatabaseSortNode;
  last: DatabaseSortNode;

  constructor(descending: boolean, ...names: string[]) {
    if (names.length < 1)
      throw new Error(
        "You need to provide at least one name to the sort expression."
      );
    this.first = new DatabaseSortNode(names[0], descending);
    this.last = this.first;
    for (let i = 1; i < names.length; i++) {
      this.last.next = new DatabaseSortNode(names[i], descending);
      this.last = this.last.next;
    }
  }

  thenOrderBy(descending: boolean, ...names: string[]): DatabaseSortExpression {
    for (const n of names) {
      this.last.next = new DatabaseSortNode(n, descending);
      this.last = this.last.next;
    }
    return this;
  }

  sort(array: any[]) {
    let node = this.first;
    while (node !== undefined) {
      array.sort(node.createAscendingComparer);
      node = node.next;
    }
  }
}
