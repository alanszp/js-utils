import { Job } from "@alanszp/queue";
import { ITotalCountReporter } from "./ITotalCountReporter";

export class JobTotalCountReporter<JobInstance extends Job>
  implements ITotalCountReporter
{
  private total = 1;

  private current = 0;

  private job: JobInstance;

  constructor(job: JobInstance) {
    this.job = job;
  }

  setTotal(total: number): void {
    this.total = total;
    this.reset();
  }

  increment(n?: number): void {
    this.current += n ?? 1;
    this.report();
  }

  reset(value?: number): void {
    this.current = value ?? 0;
    this.report();
  }

  report() {
    this.job
      .updateProgress({ total: this.total, current: this.current })
      .catch(() => {});
  }
}
