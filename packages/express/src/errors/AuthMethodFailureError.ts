import { HttpRenderableError, RenderableContext } from "@alanszp/errors";

export class AuthenticationMethodError extends HttpRenderableError {
  public requiredChecks: string[];

  constructor(requiredChecks: string[]) {
    super("Authentication Method Error");
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
