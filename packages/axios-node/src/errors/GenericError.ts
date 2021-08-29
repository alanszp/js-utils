import { AxiosError } from "axios";
import { RequestError } from "./RequestError";

export class GenericError extends RequestError {
  constructor(error: Error) {
    super("Generic Error", error);
  }
}
