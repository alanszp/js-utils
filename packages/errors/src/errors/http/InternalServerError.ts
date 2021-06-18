import { RenderableContext } from "../RenderableError";
import { HttpError } from "./HttpError";

export class InternalServerError extends HttpError {
  public error;

  constructor(error?: unknown) {
    super();
    this.error = error;
  }

  public renderMessage(): string {
    return "Internal Server Error";
  }

  public context(): RenderableContext {
    if (process.env.NODE_ENV === "production") {
      return {};
    }

    return {
      errors: this.error,
    };
  }
}
