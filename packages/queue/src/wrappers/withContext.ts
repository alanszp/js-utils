import { createId } from "@paralleldrive/cuid2";
import { appIdentifier } from "@alanszp/core";
import { Job, JobData } from "bullmq";
import { WorkerContext } from "../worker/worker";
import { JobReturnValue } from "../types";
import { compact } from "lodash";

export function withContext<T = JobData, ReturnValue = JobReturnValue>(
  queueName: string,
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
        lifecycleId: lid || createId(),
        lifecycleChain:
          compact([lch, `wkr:${queueName}`]).join(",") || appIdentifier(),
        contextId: createId(),
      }
    );
  };
}
