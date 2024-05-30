import { Job, JobsOptions, RepeatOptions } from "bullmq";
import { JobData, JobReturnValue } from "../types";
import { BaseQueue } from "./baseQueue";

export class RepeatableQueue<
  Data = JobData,
  ReturnValue = JobReturnValue
> extends BaseQueue<Data, ReturnValue> {
  async publishRepeatableJob(
    job: Data,
    repeatOptions: RepeatOptions,
    jobId: string,
    opts?: JobsOptions
  ): Promise<Job<Data, ReturnValue>> {
    return this.queue.add(this.name, job, {
      ...opts,
      repeat: { ...repeatOptions },
      jobId,
    });
  }

  async removeRepeatableJobByKey(repeatJobKey: string): Promise<boolean> {
    return this.queue.removeRepeatableByKey(repeatJobKey);
  }

  async removeRepeatableJobByConfig(
    repeatOptions: RepeatOptions,
    jobId: string
  ): Promise<boolean> {
    return this.queue.removeRepeatable(this.name, repeatOptions, jobId);
  }
}
