import { HttpRenderableError } from "./HttpRenderableError";
import { RenderableContext, RenderableError } from "./RenderableError";

export class InternalServerError extends HttpRenderableError {
  public error;

  constructor(error?: unknown) {
    super("Internal Server Error");
    this.error = error;
  }

  httpCode(): number {
    return 500;
  }

  public context(): RenderableContext {
    if (process.env.NODE_ENV === "production") {
      return {};
    }

    return {
      error: {
        name: this.error.name,
        message: this.error.message,
        ...(this.error instanceof RenderableError ? this.error.toView() : {}),
        status: this.error.status,
        signal: this.error.signal,
        stack: this.error.stack,
      },
    };
  }
}
