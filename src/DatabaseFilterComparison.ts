/**
 * This enumerates all possible (aka coded) comparisons between values.
 *
 * @author Rodrigo Portela
 */
export enum DatabaseFilterComparison {
  EQUAL_TO,
  NOT_EQUAL_TO,
  GREATER_THAN,
  GREATER_OR_EQUAL,
  LOWER_THAN,
  LOWER_OR_EQUAL,
  IN,
  NOT_IN,
  LIKE,
  NOT_LIKE,
}
