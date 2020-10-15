import { DatabaseFilter } from "./DatabaseFilter";
import { DatabaseFilterComparison } from "./DatabaseFilterComparison";
import { DatabaseFilterComposition } from "./DatabaseFilterComposition";
import { DatabaseFilterExpression } from "./DatabaseFilterExpression";
import { DatabaseFilterNode } from "./DatabaseFilterNode";
import { DatabaseFilterTerm } from "./DatabaseFilterTerm";
import { DatabaseSortExpression } from "./DatabaseSortExpression";
import { DatabaseSortNode } from "./DatabaseSortNode";

const FORBIDDEN_NAME_PARTS = ["--", "+", "?", "!", "'", '"', "(", ")", ";"];

export class DatabaseSqlDialect {
  text: string[] = [];
  params: any[] = [];
  namePrefix?: string;
  nameSuffix?: string;
  placeholder: string = "?";

  formatName(name: string) {
    for (const forbidden of FORBIDDEN_NAME_PARTS)
      if (name.indexOf(forbidden))
        throw Error("SQL names can't contain " + forbidden);
    return this.namePrefix ? this.namePrefix + name + this.nameSuffix : name;
  }

  getComparisonSql(comparison: DatabaseFilterComparison) {
    switch (comparison) {
      case DatabaseFilterComparison.EQUAL_TO:
        return "=";
      case DatabaseFilterComparison.GREATER_OR_EQUAL:
        return ">=";
      case DatabaseFilterComparison.GREATER_THAN:
        return ">";
      case DatabaseFilterComparison.IN:
        return "IN";
      case DatabaseFilterComparison.LIKE:
        return "LIKE";
      case DatabaseFilterComparison.LOWER_OR_EQUAL:
        return "<=";
      case DatabaseFilterComparison.LOWER_THAN:
        return "<";
      case DatabaseFilterComparison.NOT_EQUAL_TO:
        return "!=";
      case DatabaseFilterComparison.NOT_IN:
        return "NOT IN";
      case DatabaseFilterComparison.NOT_LIKE:
        return "NOT LIKE";
      default:
        throw Error("Unknown comparison " + comparison);
    }
  }

  appendFilterTerm(term: DatabaseFilterTerm): DatabaseSqlDialect {
    this.text.push(this.formatName(term.name));
    this.text.push(this.getComparisonSql(term.comparison));
    this.text.push(this.placeholder);
    this.params.push(term.value);
    return this;
  }

  appendFilterNode(node: DatabaseFilterNode): DatabaseSqlDialect {
    this.appendFilter(node.filter);
    if (node.next) {
      switch (node.composition) {
        case DatabaseFilterComposition.AND:
          this.text.push("AND");
          break;
        case DatabaseFilterComposition.OR:
          this.text.push("OR");
          break;
        default:
          throw Error("Unknown filter composition " + node.composition);
      }
      this.appendFilter(node.next);
    }
    return this;
  }

  appendFilterExpression(expr: DatabaseFilterExpression): DatabaseSqlDialect {
    this.text.push("(");
    this.appendFilterNode(expr.first);
    this.text.push(")");
    return this;
  }

  appendFilter(filter: DatabaseFilter): DatabaseSqlDialect {
    if (filter instanceof DatabaseFilterExpression)
      return this.appendFilterExpression(filter);
    else if (filter instanceof DatabaseFilterNode)
      return this.appendFilterNode(filter);
    else if (filter instanceof DatabaseFilterTerm)
      return this.appendFilterTerm(filter);
    else throw Error("Unknown filter type " + typeof filter);
  }

  appendSortNode(node: DatabaseSortNode): DatabaseSqlDialect {
    this.text.push(this.formatName(node.name));
    if (node.descending === true) this.text.push("DESC");
    return this;
  }

  appendSortExpression(expr: DatabaseSortExpression): DatabaseSqlDialect {
    this.appendSortNode(expr.first);
    for (let node = expr.first.next; node != null; node = node.next) {
      this.text.push(",");
      this.appendSortNode(node);
    }
    return this;
  }

  appendOffset(offset: number) {
    this.text.push("OFFSET " + offset);
  }

  appendLimit(limit: number) {
    this.text.push("LIMIT " + limit);
  }

  appendQuery(props: {
    from: string;
    columns?: string | string[];
    where?: DatabaseFilter;
    orderBy?: DatabaseSortExpression;
    offset?: number;
    limit?: number;
  }): DatabaseSqlDialect {
    this.text.push("SELECT");
    if (props.columns) {
      if (Array.isArray(props.columns)) {
        props.columns.forEach((col) => this.text.push(this.formatName(col)));
      } else {
        this.text.push(this.formatName(props.columns));
      }
    } else {
      this.text.push("*");
    }
    this.text.push("FROM");
    this.text.push(this.formatName(props.from));
    if (props.where) {
      this.text.push("WHERE");
      this.appendFilter(props.where);
    }
    if (props.orderBy) {
      this.text.push("ORDER BY");
      this.appendSortExpression(props.orderBy);
    }
    if (props.offset) this.appendOffset(props.offset);
    if (props.limit) this.appendLimit(props.limit);
    return this;
  }
}
