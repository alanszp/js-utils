import { AxiosError } from "axios";
import { RequestError } from "./RequestError";

export class NetworkRequestError<T> extends RequestError {
  public error: AxiosError<T>;
  public request: any;

  constructor(error: AxiosError<T>) {
    super("Network Error", error);
    this.request = error.request;
  }
}
