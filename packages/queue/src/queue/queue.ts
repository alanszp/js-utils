import { merge } from "lodash";
import { Job, JobsOptions, RepeatOptions } from "bullmq";
import { ListResult } from "@alanszp/core";
import { SharedContext } from "@alanszp/shared-context";
import {
  ConnectionOptions,
  JobData,
  JobReturnValue,
  JobStateEnum,
  JobTypeEnum,
  QueueOptions,
  RawQueue,
} from "../types";
import { JobNotFoundError } from "../errors/JobNotFoundError";
import { JobCannotBePromotedError } from "../errors/JobCannotBePromotedError";
import { ResultTypes } from "ioredis/built/utils/RedisCommander";

const BULL_PREFIX = "b";

const DEFAULT_COMPLETED_JOB_MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 30;
const DEFAULT_COMPLETED_JOB_MAX_COUNT = 500;
const DEFAULT_FAILED_JOB_MAX_COUNT = 1000;

export class Queue<Data = JobData, ReturnValue = JobReturnValue> {
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

    this._queue = new RawQueue<Data>(name, {
      ...merge(
        {
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
          connection,
        },
        queueOptions || {}
      ),
      ...{ prefix: `{${prefix}}:${BULL_PREFIX}` },
    });
  }

  public getName(): string {
    return this.name;
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

  async publishRepeatableJob(
    job: Data,
    repeatOptions: RepeatOptions,
    jobId: string
  ): Promise<Job<Data, ReturnValue>> {
    return this.queue.add(this.name, job, { ...repeatOptions, jobId });
  }

  async removeRepeatableJobByKey(repeatJobKey: string): Promise<boolean> {
    return this.queue.removeRepeatableByKey(repeatJobKey);
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

  private pageToStartEnd(pageNumber: number, pageSize: number) {
    return {
      start: (pageNumber - 1) * pageSize,
      end: pageNumber * pageSize - 1,
    };
  }

  public async getJobsAndCountByStatus(
    statuses: JobTypeEnum[],
    page: number = 1,
    pageSize: number = 50,
    ascending: boolean = false
  ): Promise<ListResult<Job<Data, ReturnValue>>> {
    const { start, end } = this.pageToStartEnd(page, pageSize);
    const [total, elements] = await Promise.all([
      this.queue.getJobCountByTypes(...statuses),
      this.queue.getJobs(statuses, start, end, ascending),
    ]);

    return {
      total,
      elements,
      page,
      pageSize,
    };
  }

  public async getJobCountByStatus(
    statuses: JobTypeEnum[],
    page: number = 1,
    pageSize: number = 50
  ): Promise<number> {
    return this.queue.getJobCountByTypes(...statuses);
  }

  public async getJobsByStatus(
    statuses: JobTypeEnum[],
    page: number = 1,
    pageSize: number = 50,
    ascending: boolean = false
  ): Promise<Job<Data, ReturnValue>[]> {
    const { start, end } = this.pageToStartEnd(page, pageSize);
    return this.queue.getJobs(statuses, start, end, ascending);
  }

  public async deleteJob(jobId: string) {
    this.queue.remove(jobId);
  }

  public async getJob(
    jobId: string
  ): Promise<Job<Data, ReturnValue> | undefined> {
    return this.queue.getJob(jobId);
  }

  public async getJobOrFail(jobId: string): Promise<Job<Data, ReturnValue>> {
    const job = await this.queue.getJob(jobId);
    if (!job) throw new JobNotFoundError(jobId);
    return job;
  }

  public async changeDelayToJob(jobId: string, delayMs: number) {
    const job = await this.getJobOrFail(jobId);

    const state = await job.getState();
    if (state !== JobStateEnum.DELAYED) {
      throw new JobCannotBePromotedError(jobId, state);
    }

    job.changeDelay(delayMs);
  }

  async close(): Promise<void> {
    await this.queue.close();
  }

  private get queue(): RawQueue<Data, ReturnValue> {
    return this._queue;
  }
}
