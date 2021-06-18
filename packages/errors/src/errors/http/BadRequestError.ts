import { RenderableContext } from "../RenderableError";
import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
  private errors;

  public constructor(errors: string[] | string) {
    super();
    this.errors = errors;
  }

  public renderMessage(): string {
    return "Bad Request";
  }

  public context(): RenderableContext {
    return {
      errors: this.errors,
    };
  }
}
