import { RenderableContext } from "@alanszp/errors";
import { PermissionServiceError } from "./PermissionServiceError";

export class PermissionServiceRequestError extends PermissionServiceError {
  error: unknown;

  constructor(error: unknown) {
    super("Permission service request error");
    this.error = error;
  }

  renderMessage(): string {
    return "Permission service request failed. Could not validate permission integrity";
  }

  httpCode(): number {
    return 500;
  }

  context(): RenderableContext {
    return {
      error: this.error,
    };
  }
}
