import { ILogger, LogType } from "@alanszp/logger";
import { difference } from "lodash";
import { AuditBody, REQUIRED_FIELDS } from ".";
import { AuditWithState } from "./auditWithState";
import { MissingAuditFieldsError } from "./errors/MissingAuditFieldsError";

export class Audit {
  public logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public log(body: AuditBody): void {
    const missingFields = difference(REQUIRED_FIELDS, Object.keys(body));

    if (missingFields.length > 0) {
      throw new MissingAuditFieldsError(missingFields);
    }

    this.logger.info(body.action, {
      log_type: LogType.AUDIT,
      ...body,
      action: undefined,
    });
  }

  public withState(): AuditWithState {
    return new AuditWithState(this);
  }
}
