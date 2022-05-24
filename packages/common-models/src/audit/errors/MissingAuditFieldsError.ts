import { RenderableContext, RenderableError } from "@alanszp/errors";
import { AuditError } from "./AuditError";

export class MissingAuditFieldsError
  extends AuditError
  implements RenderableError
{
  public missingFields: string[];

  constructor(missingFields: string[]) {
    super("MissingAuditFieldsError");
    this.missingFields = missingFields;
  }

  code(): string {
    return "missing_audit_fields_error";
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
