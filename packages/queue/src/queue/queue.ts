import { merge } from "lodash";
import { Job, JobsOptions } from "bullmq";
import { SharedContext } from "@alanszp/shared-context";
import {
  ConnectionOptions,
  JobData,
  JobReturnValue,
  QueueOptions,
} from "../types";
import { BaseQueue } from "./baseQueue";

const DEFAULT_COMPLETED_JOB_MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 30;
const DEFAULT_COMPLETED_JOB_MAX_COUNT = 500;
const DEFAULT_FAILED_JOB_MAX_COUNT = 1000;
const DEFAULT_OPTIONS = {
  defaultJobOptions: {
    removeOnComplete: {
      age: DEFAULT_COMPLETED_JOB_MAX_AGE_IN_SECONDS,
      count: DEFAULT_COMPLETED_JOB_MAX_COUNT,
    },
    removeOnFail: {
      count: DEFAULT_FAILED_JOB_MAX_COUNT,
    },
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
  },
};

export class Queue<
  Data = JobData,
  ReturnValue = JobReturnValue
> extends BaseQueue<Data, ReturnValue> {
  constructor(
    connection: ConnectionOptions,
    name: string,
    prefix: string,
    getSharedContext: () => SharedContext,
    queueOptions: QueueOptions = {}
  ) {
    super(
      connection,
      name,
      prefix,
      getSharedContext,
      merge(DEFAULT_OPTIONS, queueOptions)
    );
  }

  async publishJob(
    job: Data,
    opts?: JobsOptions
  ): Promise<Job<Data, ReturnValue>> {
    const context = this.getSharedContext();
    const lid = context.getLifecycleId();
    const lch = context.getLifecycleChain();
    return this.queue.add(this.name, { ...job, lid, lch }, opts);
  }

  async publishBulkJob(jobDatas: Data[]): Promise<Job<Data, ReturnValue>[]> {
    const jobs = jobDatas.map((data) => ({ name: this.name, data }));
    return this.queue.addBulk(jobs);
  }

  async publishBulkJobWithOptions(
    jobDefinitions: { jobData: Data; opts: JobsOptions }[]
  ): Promise<Job<Data, ReturnValue>[]> {
    const jobs = jobDefinitions.map(({ jobData: data, opts }) => ({
      name: this.name,
      data,
      opts,
    }));
    return this.queue.addBulk(jobs);
  }
}
