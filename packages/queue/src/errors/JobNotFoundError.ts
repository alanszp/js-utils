import { BaseError, RenderableContext, RenderableError } from "@alanszp/errors";

export class JobNotFoundError extends BaseError implements RenderableError {
  public jobId: string;

  constructor(jobId: string) {
    super("JobNotFoundError");
    this.jobId = jobId;
  }

  code(): string {
    return "job_not_found_error";
  }

  renderMessage(): string {
    return "Job not found";
  }

  context(): RenderableContext {
    return {
      jobId: this.jobId,
    };
  }
}
