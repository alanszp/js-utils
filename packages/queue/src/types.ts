// decoupling from bullmq
export {
  ConnectionOptions,
  RedisOptions,
  Job,
  Worker as RawWorker,
  WorkerOptions,
  Queue as RawQueue,
  QueueOptions,
  JobState,
  JobType,
  JobsOptions,
} from "bullmq";

export type JobData = unknown;

export type JobReturnValue = unknown;

export enum JobStateEnum {
  ACTIVE = "active",
  DELAYED = "delayed",
  WAITING = "waiting",
  COMPLETED = "completed",
  FAILED = "failed",
  WAITING_CHILDREN = "waiting-children",
}

export enum JobTypeEnum {
  ACTIVE = "active",
  DELAYED = "delayed",
  WAITING = "waiting",
  COMPLETED = "completed",
  FAILED = "failed",
  WAITING_CHILDREN = "waiting-children",
  PAUSED = "paused",
  REPEAT = "repeat",
  WAIT = "wait",
}
