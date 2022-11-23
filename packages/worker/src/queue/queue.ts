import { merge } from "lodash";
import { ConnectionOptions, JobData, QueueOptions, RawQueue } from "../types";

const BULL_PREFIX = "b";

const DEFAULT_COMPLETED_JOB_MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 30;
const DEFAULT_COMPLETED_JOB_MAX_COUNT = 500;

export class Queue<JobType = JobData> {
  private _queue: RawQueue;

  private name: string;

  constructor(connection: ConnectionOptions, name: string, prefix: string, queueOptions?: QueueOptions) {
    this.name = name;

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

  async publishJob(job: JobType): Promise<void> {
    await this.queue.add(this.name, job);
  }

  async publishBulkJob(jobDatas: JobType[]): Promise<void> {
    const jobs = jobDatas.map((data) => ({ name: this.name, data }));
    await this.queue.addBulk(jobs);
  }

  async close(): Promise<void> {
    await this.queue.close();
  }

  private get queue(): RawQueue<JobType> {
    return this._queue;
  }
}
