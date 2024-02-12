import { ITotalCountReporter } from "./ITotalCountReporter";

export class MockTotalCountReporter implements ITotalCountReporter {
  private total = 1;

  private progress = 0;

  setTotal(total: number): void {
    this.total = total;
    this.reset();
  }

  increment(n?: number): void {
    this.progress += n ?? 1;
  }

  reset(value?: number): void {
    this.progress = value ?? 0;
  }
}
