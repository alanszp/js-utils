import { BaseModel } from "@alanszp/validations";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NotificationDetailType } from "./NotificationDetailTypes";

type FixedDetail<T> = {
  id: string;
  organizationReference: string;
  _previousValues: T;
  lch: string;
};

type Detail<T> = FixedDetail<T> & T;

export interface NotificationInputParams<T> {
  version: string;
  id: string;
  "detail-type": NotificationDetailType;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: unknown[];
  detail: Detail<T>;
}

export class NotificationInput<T> extends BaseModel {
  @IsString()
  @IsNotEmpty()
  public version: string;

  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsEnum(NotificationDetailType)
  @IsNotEmpty()
  public detailType: NotificationDetailType;

  @IsString()
  @IsNotEmpty()
  public organizationReference: string;

  public data: Detail<T>;

  constructor(params: NotificationInputParams<T>) {
    super();
    this.organizationReference = params.detail.organizationReference;
    this.detailType = params["detail-type"];
    this.id = params.detail.id;
    this.data = params.detail;
    this.version = params.version;
  }
}
