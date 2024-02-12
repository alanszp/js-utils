import { ILogger } from "@alanszp/logger";
import { BaseModel } from "@alanszp/validations";
import { CreateAsyncJobInput } from "../inputs/CreateAsyncJobInput";
import { Queue } from "../../queue/queue";
import { Job } from "../../types";

export async function asyncJobCreationCommand<
  QueueInputBody,
  RealInput extends BaseModel & QueueInputBody,
  AsyncInput extends CreateAsyncJobInput<RealInput>
>(
  logger: ILogger,
  queue: Queue<QueueInputBody>,
  input: AsyncInput
): Promise<Job<QueueInputBody>> {
  const child = logger.child({
    input,
    queueName: queue.getName(),
  });

  child.info("worker.async.create_job.starting");
  await input.validate();

  child.debug("worker.async.create_job.validated");

  const job = await queue.publishJob(input.asyncInput, {
    delay: input.getDelayInMs(),
  });

  child.debug("worker.async.create_job.succeed", { jobId: job.id });

  return job;
}

export async function immediateExecutionJobCreationCommand<
  QueueInputBody,
  RealInput extends QueueInputBody & BaseModel
>(
  logger: ILogger,
  queue: Queue<QueueInputBody>,
  input: RealInput
): Promise<Job<QueueInputBody>> {
  const child = logger.child({
    input,
    queueName: queue.getName(),
  });

  child.info("worker.async.create_job.starting");
  await input.validate();

  child.debug("worker.async.create_job.validated");

  const job = await queue.publishJob(input);

  child.debug("worker.async.create_job.succeed", { jobId: job.id });

  return job;
}
