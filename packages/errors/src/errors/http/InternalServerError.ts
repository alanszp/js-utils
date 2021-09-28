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
      error: {
        name: this.error.name,
        message: this.error.message,
        code: this.error.code,
        context: this.error.context,
        renderMessage: this.error.renderMessage,
        stack: this.error.stack,
        status: this.error.status,
        signal: this.error.signal,
      },
    };
  }
}
