import { RenderableContext } from "@alanszp/errors";
import { AuditError } from "./AuditError";

export class MissingAuditFieldsError extends AuditError {
  public missingFields: string[];

  constructor(missingFields: string[]) {
    super("MissingAuditFieldsError");
    this.missingFields = missingFields;
  }

  httpCode(): number {
    return 500;
  }

  renderMessage(): string {
    return "Missing properties on audit log.";
  }

  context(): RenderableContext {
    return {
      missingFields: this.missingFields,
    };
  }
}
