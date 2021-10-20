import { BaseError } from "@alanszp/errors";
import { AxiosError } from "axios";

export abstract class RequestError<T> extends BaseError {
  private error: AxiosError<T>;

  constructor(message: string, error: AxiosError<T>) {
    super(message);
    this.error = error;
  }

  public getAxiosError() {
    return this.error;
  }
}
