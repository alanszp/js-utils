import { HttpRenderableError, RenderableContext } from "@alanszp/errors";

export class NoPermissionError extends HttpRenderableError {
  permissionsNotMet: string[];

  constructor(permissionsNotMet: string[]) {
    super("No permission error");
    this.permissionsNotMet = permissionsNotMet;
  }

  httpCode(): number {
    return 403;
  }

  context(): RenderableContext {
    return {
      permissionsNotMet: this.permissionsNotMet,
    };
  }
}
