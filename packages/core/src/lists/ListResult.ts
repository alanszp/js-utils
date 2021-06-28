export interface ListResult<Result> {
  elements: Result[];
  total: number;
  page: number;
  pageSize: number;
}

export function mapListResult<T, R>(
  list: ListResult<T>,
  mapper: (elem: T) => R
): ListResult<R> {
  return {
    ...list,
    elements: list.elements.map((c) => mapper(c)),
  };
}
