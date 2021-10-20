import { RequestError } from "./RequestError";
import { AxiosError } from "axios";

export class GenericError<T> extends RequestError<T> {
  constructor(error: AxiosError<T>) {
    super("Generic Error", error);
  }
}
