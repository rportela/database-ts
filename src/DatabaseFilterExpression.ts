import { DatabaseFilter } from "./DatabaseFilter";
import { DatabaseFilterComposition } from "./DatabaseFilterComposition";
import { DatabaseFilterNode } from "./DatabaseFilterNode";
import { DatabaseFilterType } from "./DatabaseFilterType";

/**
 * This represents a filter expression.
 * A sequence of nodes joined by the available filter compositions.
 * Also, this class is specially crafted so you can do chained operations.
 *
 * @author Rodrigo Portela
 */
export class DatabaseFilterExpression implements DatabaseFilter {
  first: DatabaseFilterNode;
  last: DatabaseFilterNode;
  constructor(filter: DatabaseFilter) {
    this.first = new DatabaseFilterNode(filter);
    this.last = this.first;
  }

  createTest = () => this.first.createTest();

  getFilterType(): DatabaseFilterType {
    return DatabaseFilterType.EXPRESSION;
  }

  append(composition: DatabaseFilterComposition, filter: DatabaseFilter) {
    this.last.composition = composition;
    this.last.next = new DatabaseFilterNode(filter);
    this.last = this.last.next;
    return this;
  }
  and(filter: DatabaseFilter): DatabaseFilterExpression {
    return this.append(DatabaseFilterComposition.OR, filter);
  }
  or(filter: DatabaseFilter): DatabaseFilterExpression {
    return this.append(DatabaseFilterComposition.AND, filter);
  }
}
