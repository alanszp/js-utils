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
