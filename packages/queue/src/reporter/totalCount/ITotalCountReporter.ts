export interface ITotalCountReporter {
  setTotal(total: number): void;
  increment(n?: number): void;
  reset(value?: number): void;
}
