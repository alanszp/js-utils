import { merge } from "lodash";
import { Job, JobsOptions } from "bullmq";
import { SharedContext } from "@alanszp/shared-context";
import {
  ConnectionOptions,
  JobData,
  JobReturnValue,
  JobTypeEnum,
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

  /**
   * This method is used to debounce a job.
   * It will check if there are any jobs waiting to be processed, if there are it
   * will not schedule the job and let finish the current scheduled one.
   *
   * This type of publishing will have a max of 1 job waiting to be processed.
   *
   * @param debounceMs Time in MS to debounce the job
   * @param job Job data
   * @param opts Job options
   * @returns Returns undefined if the job was already scheduled, else returns the job published
   */
  async debouncePublishJob(
    debounceMs: number,
    job: Data,
    opts?: JobsOptions
  ): Promise<Job<Data, ReturnValue> | undefined> {
    const countWaiting = await this.getJobCountByStatus([JobTypeEnum.DELAYED]);
    if (countWaiting !== 0) return;

    await this.publishJob(job, {
      ...opts,
      delay: debounceMs,
    });
  }
}
