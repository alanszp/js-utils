import { RenderableContext } from "@alanszp/errors";
import { PermissionServiceError } from "./PermissionServiceError";

export class PermissionServiceNotInstantiated extends PermissionServiceError {
  constructor() {
    super("Permission service not instantiated");
  }

  httpCode(): number {
    return 500;
  }

  context(): RenderableContext {
    return {};
  }
}
