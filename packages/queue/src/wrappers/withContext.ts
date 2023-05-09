import cuid from "cuid";
import { appIdentifier } from "../helpers/appIdentifier";
import { Job, JobData } from "bullmq";
import { WorkerContext } from "../worker/worker";

export function withContext<T = JobData>(
  workerContext: WorkerContext,
  executor: (job: Job<T>) => Promise<void>
): (job: Job<T>) => Promise<void> {
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
