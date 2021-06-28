export interface Paginable<Validated extends boolean = false> {
  pageSize: Validated extends true ? number : number | string;
  page: Validated extends true ? number : number | string;
}

export function getPageObject<T extends Paginable<true>>(object: T) {
  return {
    skip: (object.page - 1) * object.pageSize,
    take: object.pageSize,
  };
}

export function extractPaginableParams<T extends Paginable>(
  object: T
): Paginable<true> {
  return {
    page: Number.parseInt(object.page as string, 10),
    pageSize: Number.parseInt(object.pageSize as string, 10),
  };
}
