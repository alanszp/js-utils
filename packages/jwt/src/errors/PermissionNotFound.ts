import { RenderableContext } from "@alanszp/errors";
import { PermissionServiceError } from "./PermissionServiceError";

export class PermissionDefinitionNotFound extends PermissionServiceError {
  permissionCode: string;

  constructor(permissionCode: string) {
    super("Permission not found");
    this.permissionCode = permissionCode;
  }

  renderMessage(): string {
    return "Permission code not found in the permission definitions";
  }

  httpCode(): number {
    // 500 Internal Server Error because this indicates a configuration problem.
    return 500;
  }

  context(): RenderableContext {
    return {
      permissionCode: this.permissionCode,
    };
  }
}
