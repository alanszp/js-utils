import { Job, JobData } from "bullmq";
import { ListResult } from "@alanszp/core";
import { JobReturnValue, JobTypeEnum, RawQueue } from "../types";
import { BaseQueue } from "./baseQueue";

export class MockBaseQueue<Data = JobData, ReturnValue = JobReturnValue>
  implements Omit<BaseQueue<Data, ReturnValue>, "_queue">
{
  public getName(): string {
    return "Mocked queue";
  }

  public getJobsAndCountByStatus(
    statuses: JobTypeEnum[],
    page?: number,
    pageSize?: number,
    ascending?: boolean
  ): Promise<ListResult<Job<Data, ReturnValue, string>>> {
    return Promise.resolve({
      elements: [],
      total: 0,
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    });
  }

  public getJobCountByStatus(statuses: JobTypeEnum[]): Promise<number> {
    return Promise.resolve(0);
  }

  public getJobsByStatus(
    statuses: JobTypeEnum[],
    page?: number,
    pageSize?: number,
    ascending?: boolean
  ): Promise<Job<Data, ReturnValue, string>[]> {
    return Promise.resolve([]);
  }

  public deleteJob(jobId: string): Promise<void> {
    return Promise.resolve();
  }

  public getJob(
    jobId: string
  ): Promise<Job<Data, ReturnValue, string> | undefined> {
    return Promise.resolve({} as Job<Data, ReturnValue, string>);
  }

  public getJobOrFail(jobId: string): Promise<Job<Data, ReturnValue, string>> {
    return Promise.resolve({} as Job<Data, ReturnValue, string>);
  }

  public changeDelayToJob(jobId: string, delayMs: number): Promise<void> {
    return Promise.resolve();
  }

  public close(): Promise<void> {
    return Promise.resolve();
  }

  protected get queue(): RawQueue<Data, ReturnValue, string> {
    throw new Error("Method not implemented.");
  }
}
