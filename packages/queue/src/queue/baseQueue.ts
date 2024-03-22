import { merge } from "lodash";
import { Job } from "bullmq";
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

const BULL_PREFIX = "b";

function buildOptions(
  connection: ConnectionOptions,
  prefix: string,
  queueOptions: QueueOptions = {}
) {
  return {
    ...merge(
      {
        ...queueOptions,
        connection,
      },
      queueOptions
    ),
    ...{ prefix: `{${prefix}}:${BULL_PREFIX}` },
  };
}

export class BaseQueue<Data = JobData, ReturnValue = JobReturnValue> {
  protected _queue: RawQueue;

  protected name: string;

  protected getSharedContext: () => SharedContext;

  constructor(
    connection: ConnectionOptions,
    name: string,
    prefix: string,
    getSharedContext: () => SharedContext,
    queueOptions?: QueueOptions
  ) {
    this.name = name;

    this.getSharedContext = getSharedContext;
    this._queue = new RawQueue<Data>(
      name,
      buildOptions(connection, prefix, queueOptions)
    );
  }

  public getName(): string {
    return this.name;
  }

  protected pageToStartEnd(pageNumber: number, pageSize: number) {
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

  public async getJobCountByStatus(statuses: JobTypeEnum[]): Promise<number> {
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

  protected get queue(): RawQueue<Data, ReturnValue> {
    return this._queue;
  }
}
