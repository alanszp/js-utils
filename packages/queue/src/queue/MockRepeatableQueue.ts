import { Job, JobData, JobsOptions, RepeatOptions } from "bullmq";
import { JobReturnValue } from "../types";
import { MockBaseQueue } from "./MockBaseQueue";
import { RepeatableQueue } from "./repeatableQueue";

export class MockRepeatableQueue<Data = JobData, ReturnValue = JobReturnValue>
  extends MockBaseQueue<Data, ReturnValue>
  implements Omit<RepeatableQueue<Data, ReturnValue>, "_queue">
{
  public publishRepeatableJob(
    job: Data,
    repeatOptions: RepeatOptions,
    jobId: string,
    opts?: JobsOptions | undefined
  ): Promise<Job<Data, ReturnValue, string>> {
    return Promise.resolve({} as Job<Data, ReturnValue, string>);
  }

  public removeRepeatableJobByKey(repeatJobKey: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  removeRepeatableJobByConfig(
    repeatOptions: RepeatOptions,
    jobId: string
  ): Promise<boolean> {
    return Promise.resolve(true);
  }
}
