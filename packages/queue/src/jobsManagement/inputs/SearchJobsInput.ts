import {
  IsDefined,
  IsArray,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { BaseModel } from "@alanszp/validations";
import { JobTypeEnum } from "../../types";
import { assignPaginableKeys } from "@alanszp/core";

export interface SearchJobInputProps {
  status: JobTypeEnum[];
  page?: string | number;
  pageSize?: number;
}

export class SearchJobsInput extends BaseModel {
  @IsDefined()
  @IsArray()
  @IsEnum(JobTypeEnum, { each: true })
  public status: JobTypeEnum[];

  @IsDefined()
  @IsNumber()
  @Min(1)
  public page: number;

  @IsDefined()
  @IsNumber()
  @Min(1)
  @Max(100)
  public pageSize: number;

  constructor({ status, page, pageSize }: SearchJobInputProps) {
    super();
    this.status = status;
    assignPaginableKeys(this, { page, pageSize });
  }

  async validate(): Promise<void> {
    await super.validate();
  }
}
