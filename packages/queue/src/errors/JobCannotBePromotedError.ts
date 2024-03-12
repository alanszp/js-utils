import { JobState } from "bullmq";
import { RenderableContext, HttpRenderableError } from "@alanszp/errors";

export class JobCannotBePromotedError extends HttpRenderableError {
  public jobId: string;

  public currentJobState: JobState | "unknown";

  constructor(jobId: string, currentJobState: JobState | "unknown") {
    super("Job cannot be promoted Error");
    this.jobId = jobId;
    this.currentJobState = currentJobState;
  }

  httpCode(): number {
    return 400;
  }

  context(): RenderableContext {
    return {
      jobId: this.jobId,
      currentJobState: this.currentJobState,
    };
  }
}
