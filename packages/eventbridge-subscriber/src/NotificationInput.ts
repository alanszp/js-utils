import { BaseModel } from "@alanszp/validations";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

/** @deprecated Use SubscribedEventInput instead. */
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

/** @deprecated Use SubscribedEventInput instead. */
export interface INotificationInput<T> {
  version: string;
  id: string;
  topic: string;
  createdAt: Date | string;
  data: T;
}

/** @deprecated Use SubscribedEventInput instead. */
export class NotificationInput<
    T extends Record<string, unknown> = Record<string, unknown>
  >
  extends BaseModel
  implements INotificationInput<T>
{
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

  constructor(params: INotificationInput<T> | NotificationInputParams<T>) {
    super();
    if ("topic" in params) {
      this.topic = params.topic;
      this.data = params.data;
      this.createdAt = new Date(params.createdAt);
    } else {
      this.topic = params["detail-type"];
      this.data = params.detail;
      this.createdAt = new Date(params.time);
    }
    this.id = params.id;
    this.version = params.version;
  }
}
