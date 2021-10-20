import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { RequestError } from "./RequestError";

export class Non200ResponseError<T> extends RequestError<T> {
  public request: {
    host: string;
    path: string;
    method: string;
    data: any;
    params: any;
  };
  public response: { status: number; data: any };

  constructor(error: AxiosError<T>) {
    super("Non 200 Response Error", error);
    this.request = {
      host: error.request.host,
      path: error.request.path,
      method: error.request.method,
      data: error.config.data,
      params: error.config.params,
    };
    this.response = {
      status: error.response?.status as number,
      data: error.response?.data as any,
    };
  }
}
