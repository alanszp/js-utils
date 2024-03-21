// decoupling from bullmq
import {
  QueueOptions as RawQueueOptions,
  WorkerOptions as RawWorkerOptions,
} from "bullmq";

export {
  ConnectionOptions,
  RedisOptions,
  Job,
  Worker as RawWorker,
  Queue as RawQueue,
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

export type QueueOptions = Omit<RawQueueOptions, "connection">;
export type WorkerOptions = Omit<RawWorkerOptions, "connection">;
