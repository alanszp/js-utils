export interface ListResult<Result> {
  elements: Result[];
  total: number;
  page: number;
  pageSize: number;
}
