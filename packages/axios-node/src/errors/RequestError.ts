import { BaseError } from "@alanszp/errors";
import { AxiosError } from "axios";

export abstract class RequestError extends BaseError {
  public error: Error;

  constructor(message: string, error: Error) {
    super(message);
    this.error = error;
  }
}
