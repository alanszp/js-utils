import { RenderableContext } from "../RenderableError";
import { HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
  public requiredChecks;

  public constructor(requiredChecks: string[]) {
    super();
    this.requiredChecks = requiredChecks;
  }

  public renderMessage(): string {
    return "Unauthorized Error";
  }

  public context(): RenderableContext {
    return {
      requiredChecks: this.requiredChecks,
    };
  }
}
