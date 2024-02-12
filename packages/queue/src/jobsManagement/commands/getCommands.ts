import { ILogger } from "@alanszp/logger";
import { Job, Queue } from "@alanszp/queue";
import { GetJobInput } from "../inputs/GetJobInput";
import { SearchJobsInput } from "../inputs/SearchJobsInput";
import { ListResult } from "@alanszp/core";

export async function getJobStatus<QueueInputBody, ReturnValue>(
  logger: ILogger,
  queue: Queue<QueueInputBody, ReturnValue>,
  input: GetJobInput
): Promise<Job<QueueInputBody, ReturnValue> | undefined> {
  const child = logger.child({
    input,
    queueName: queue.getName(),
  });

  child.info("worker.get_job.starting");
  await input.validate();

  child.debug("worker.get_job.validated");

  const job = await queue.getJobOrFail(input.jobId);

  child.info("worker.get_job.succeed", { jobId: job?.id ?? null });

  return job;
}

export async function searchJobsCommand<QueueInputBody, ReturnValue>(
  logger: ILogger,
  queue: Queue<QueueInputBody, ReturnValue>,
  input: SearchJobsInput
): Promise<ListResult<Job<QueueInputBody, ReturnValue>>> {
  const child = logger.child({
    input,
    queueName: queue.getName(),
  });

  child.info("worker.get_job.starting");
  await input.validate();

  child.debug("worker.get_job.validated");

  const jobs = await queue.getJobsAndCountByStatus(
    input.status,
    input.page,
    input.pageSize
  );

  child.info("worker.get_job.succeed", {
    jobTotal: jobs.total,
    jobInPage: jobs.elements.length,
  });

  return jobs;
}
