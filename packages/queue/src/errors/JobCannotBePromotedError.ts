import { BaseError, RenderableContext, RenderableError } from "@alanszp/errors";
import { JobState } from "bullmq";

export class JobCannotBePromotedError
  extends BaseError
  implements RenderableError
{
  public jobId: string;

  public currentJobState: JobState | "unknown";

  constructor(jobId: string, currentJobState: JobState | "unknown") {
    super("JobCannotBePromotedError");
    this.jobId = jobId;
    this.currentJobState = currentJobState;
  }

  code(): string {
    return "job_cannot_be_promoted_error";
  }

  renderMessage(): string {
    return "Job not found";
  }

  context(): RenderableContext {
    return {
      jobId: this.jobId,
      currentJobState: this.currentJobState,
    };
  }
}
