import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { RequestError } from "./RequestError";

export class Non200ResponseError<T> extends RequestError {
  public error: AxiosError<T>;
  public request: any;
  public response: AxiosResponse<T>;

  constructor(error: AxiosError<T>) {
    super("Non 200 Response Error", error);
    this.request = error.request;
    this.request = error.response;
  }
}
