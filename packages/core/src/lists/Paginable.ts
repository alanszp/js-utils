export interface Paginable {
  pageSize: number;
  page: number;
}

export function getPageObject<T extends Paginable>(object: T) {
  return {
    skip: (object.page - 1) * object.pageSize,
    take: object.pageSize,
  };
}
