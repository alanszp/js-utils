import { IsDateString, IsDefined, IsOptional } from "class-validator";
import { BaseModel } from "@alanszp/validations";
import { differenceInMilliseconds } from "date-fns";

export interface CreateAsyncJobQueryParams {
  executeOn?: string;
}

export class CreateAsyncJobInput<
  RealInput extends BaseModel
> extends BaseModel {
  @IsDateString()
  @IsOptional()
  public executeOn?: string;

  @IsDefined()
  public asyncInput: RealInput;

  constructor(asyncParams: CreateAsyncJobQueryParams, asyncInput: RealInput) {
    super();
    this.executeOn = asyncParams.executeOn;
    this.asyncInput = asyncInput;
  }

  async validate(): Promise<void> {
    await super.validate();

    await this.asyncInput.validate();
  }

  getDelayInMs(): number | undefined {
    if (!this.executeOn) return undefined;
    const date = new Date(this.executeOn);
    const delay = differenceInMilliseconds(date, new Date());
    return delay > 0 ? delay : undefined;
  }
}
