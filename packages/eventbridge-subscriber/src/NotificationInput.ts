import { BaseModel } from "@alanszp/validations";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export interface NotificationInputParams<T> {
  version: string;
  id: string;
  "detail-type": string;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: T;
}

export class NotificationInput<T extends Record<string, unknown> = Record<string, unknown>> extends BaseModel {
  @IsString()
  @IsNotEmpty()
  public version: string;

  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public topic: string;

  @IsDate()
  @IsNotEmpty()
  public createdAt: Date;

  @IsNotEmpty()
  public data: T;

  constructor(params: NotificationInputParams<T>) {
    super();
    this.topic = params["detail-type"];
    this.id = params.id;
    this.data = params.detail;
    this.createdAt = new Date(params.time);
    this.version = params.version;
  }
}
