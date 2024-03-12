import { HttpRenderableError, RenderableContext } from "@alanszp/errors";

export class NoPermissionError extends HttpRenderableError {
  constructor() {
    super("No Permission");
  }

  httpCode(): number {
    return 401;
  }

  code(): string {
    return "no_permission";
  }

  renderMessage(): string {
    return "You don't have permission to perform this action";
  }

  context(): RenderableContext {
    return {};
  }
}
