import { BaseError, RenderableContext, RenderableError } from "@alanszp/errors";

export class NoPermissionError extends BaseError implements RenderableError {
  constructor() {
    super("No Permission");
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
