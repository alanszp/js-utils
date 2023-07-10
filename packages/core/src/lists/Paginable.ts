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

/**
 * Assigns the page and pageSize keys to the target object
 * @param target Paginable Input
 * @param source Paginable Source
 */
export function assignPaginableKeys<
  T extends Paginable<false>,
  K extends Partial<Paginable<false>>
>(target: T, source: K): void {
  // Mind the || operator, it's on purpose to avoid the 0 value (cause falsy value)
  target.page = Number.parseInt(source.page as string, 10) || 1;
  target.pageSize = Number.parseInt(source.pageSize as string, 10) || 100;
}
