import { AxiosError } from "axios";
import { RequestError } from "./RequestError";

export class NetworkRequestError<T> extends RequestError<T> {
  public request: {
    host: string;
    path: string;
    method: string;
    data: any;
    params: any;
  };

  constructor(error: AxiosError<T>) {
    super("Network Error", error);
    this.request = {
      host: error.request.host,
      path: error.request.path,
      method: error.request.method,
      data: error.config.data,
      params: error.config.params,
    };
  }
}
