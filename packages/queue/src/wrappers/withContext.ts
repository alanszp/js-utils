import cuid from "cuid";
import { appIdentifier } from "../helpers/appIdentifier";
import { Job, JobData } from "bullmq";
import { WorkerContext } from "../worker/worker";
import { JobReturnValue } from "../types";

export function withContext<T = JobData, ReturnValue = JobReturnValue>(
  workerContext: WorkerContext,
  executor: (job: Job<T>) => Promise<ReturnValue>
): (job: Job<T>) => Promise<ReturnValue> {
  return (job) => {
    const { lid, lch } = job.data as { lid?: string; lch?: string };
    return workerContext.sharedContext.run(
      async () => {
        return executor(job);
      },
      {
        logger: workerContext.baseLogger,
        audit: workerContext.audit.withState(),
        lifecycleId: lid || cuid(),
        lifecycleChain: lch || appIdentifier(),
        contextId: cuid(),
      }
    );
  };
}
