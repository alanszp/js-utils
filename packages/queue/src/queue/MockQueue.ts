import { Job, JobData, JobsOptions } from "bullmq";
import { JobReturnValue } from "../types";
import { Queue } from "./queue";
import { MockBaseQueue } from "./MockBaseQueue";

export class MockQueue<Data = JobData, ReturnValue = JobReturnValue>
  extends MockBaseQueue<Data, ReturnValue>
  implements Omit<Queue<Data, ReturnValue>, "_queue">
{
  public publishJob(
    job: Data,
    opts?: JobsOptions | undefined
  ): Promise<Job<Data, ReturnValue, string>> {
    return Promise.resolve({} as Job<Data, ReturnValue, string>);
  }

  public publishBulkJob(
    jobDatas: Data[]
  ): Promise<Job<Data, ReturnValue, string>[]> {
    return Promise.resolve(
      jobDatas.map(() => ({} as Job<Data, ReturnValue, string>))
    );
  }

  public publishBulkJobWithOptions(
    jobDefinitions: { jobData: Data; opts: JobsOptions }[]
  ): Promise<Job<Data, ReturnValue, string>[]> {
    return Promise.resolve(
      jobDefinitions.map(() => ({} as Job<Data, ReturnValue, string>))
    );
  }

  public debouncePublishJob(
    debounceMs: number,
    job: Data,
    opts?: JobsOptions | undefined
  ): Promise<Job<Data, ReturnValue, string>> {
    return Promise.resolve({} as Job<Data, ReturnValue, string>);
  }
}
