import { IsDefined, IsString } from "class-validator";
import { BaseModel } from "@alanszp/validations";

export class GetJobInput extends BaseModel {
  @IsDefined()
  @IsString()
  public jobId: string;

  constructor(jobId: string) {
    super();
    this.jobId = jobId;
  }

  async validate(): Promise<void> {
    await super.validate();
  }
}
