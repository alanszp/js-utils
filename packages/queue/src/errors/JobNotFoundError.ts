import { HttpRenderableError, RenderableContext } from "@alanszp/errors";

export class JobNotFoundError extends HttpRenderableError {
  public jobId: string;

  constructor(jobId: string) {
    super("Job not found");
    this.jobId = jobId;
  }

  httpCode(): number {
    return 404;
  }

  context(): RenderableContext {
    return {
      jobId: this.jobId,
    };
  }
}
