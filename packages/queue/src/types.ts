// decoupling from bullmq
export {
  ConnectionOptions,
  RedisOptions,
  Job,
  Worker as RawWorker,
  WorkerOptions,
  Queue as RawQueue,
  QueueOptions,
  JobsOptions,
} from "bullmq";

export type JobData = unknown;

export type JobReturnValue = unknown;
