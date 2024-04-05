import { HttpRenderableError } from "./HttpRenderableError";
import { RenderableContext } from "./RenderableError";

export class UnauthorizedError extends HttpRenderableError {
  public requiredChecks?: string[];

  constructor(requiredChecks?: string[]) {
    super("Unauthorized Error");
    this.requiredChecks = requiredChecks;
  }

  httpCode(): number {
    return 401;
  }

  public context(): RenderableContext {
    return {
      requiredChecks: this.requiredChecks,
    };
  }
}
