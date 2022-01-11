import { ILogger, LogType } from "@alanszp/logger";
import { difference, merge } from "lodash";
import { AuditBody, REQUIRED_FIELDS } from ".";
import { MissingAuditFieldsError } from "./errors/MissingAuditFieldsError";

export class Audit {
  public logger: ILogger;

  public additions: Partial<AuditBody>;

  constructor(logger: ILogger) {
    this.logger = logger;
    this.additions = {};
  }

  public log(body: Partial<AuditBody>): void {
    const completeBody = this.merge(body);

    const missingFields = difference(
      REQUIRED_FIELDS,
      Object.keys(completeBody)
    );

    if (missingFields.length > 0) {
      throw new MissingAuditFieldsError(missingFields);
    }

    const action = completeBody.action as string;
    delete completeBody.action;

    this.logger.info(action, { log_type: LogType.AUDIT, ...completeBody });
  }

  public add(body: Partial<AuditBody>): void {
    this.additions = this.merge(body);
  }

  public merge(body: Partial<AuditBody>): Partial<AuditBody> {
    return merge(this.additions, body);
  }
}
