// decoupling from bullmq
export {
  ConnectionOptions,
  RedisOptions,
  Job,
  Worker as RawWorker,
  WorkerOptions,
  Queue as RawQueue,
  QueueOptions,
} from "bullmq";

// This may seems odd but actual Job data type from bullmq is any 🤷‍♂️
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JobData = any;
