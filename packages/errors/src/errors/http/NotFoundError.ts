import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
  public renderMessage(): string {
    return "Not Found";
  }
}
