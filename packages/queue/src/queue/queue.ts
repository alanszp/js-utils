import { merge } from "lodash";
import { ConnectionOptions, JobData, QueueOptions, RawQueue } from "../types";
import { JobsOptions } from "bullmq";
import { SharedContext } from "@alanszp/shared-context";

const BULL_PREFIX = "b";

const DEFAULT_COMPLETED_JOB_MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 30;
const DEFAULT_COMPLETED_JOB_MAX_COUNT = 500;

export class Queue<JobType = JobData> {
  private _queue: RawQueue;

  private name: string;

  private getSharedContext: () => SharedContext;

  constructor(
    connection: ConnectionOptions,
    name: string,
    prefix: string,
    getSharedContext: () => SharedContext,
    queueOptions?: QueueOptions
  ) {
    this.name = name;

    this.getSharedContext = getSharedContext;

    this._queue = new RawQueue<JobType>(name, {
      ...merge(
        {
          defaultJobOptions: {
            removeOnComplete: {
              age: DEFAULT_COMPLETED_JOB_MAX_AGE_IN_SECONDS,
              count: DEFAULT_COMPLETED_JOB_MAX_COUNT,
            },
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: 3000,
            },
          },
          connection,
        },
        queueOptions || {}
      ),
      ...{ prefix: `{${prefix}}:${BULL_PREFIX}` },
    });
  }

  async publishJob(job: JobType, opts?: JobsOptions): Promise<void> {
    const context = this.getSharedContext();
    const lid = context.getLifecycleId();
    const lch = context.getLifecycleChain();
    await this.queue.add(this.name, { ...job, lid, lch }, opts);
  }

  async publishBulkJob(jobDatas: JobType[]): Promise<void> {
    const jobs = jobDatas.map((data) => ({ name: this.name, data }));
    await this.queue.addBulk(jobs);
  }

  async publishBulkJobWithOptions(
    jobDefinitions: { jobData: JobType; opts: JobsOptions }[]
  ): Promise<void> {
    const jobs = jobDefinitions.map(({ jobData: data, opts }) => ({
      name: this.name,
      data,
      opts,
    }));
    await this.queue.addBulk(jobs);
  }

  async close(): Promise<void> {
    await this.queue.close();
  }

  private get queue(): RawQueue<JobType> {
    return this._queue;
  }
}
