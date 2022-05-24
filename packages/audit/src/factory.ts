import { ILogger, LogLevel } from "@alanszp/common-models";
import { createLogger } from "@alanszp/logger";
import { Audit } from "@alanszp/common-models";

export function createAuditLogger(appName: string): Audit;
export function createAuditLogger(logger: ILogger): Audit;
export function createAuditLogger(appNameOrLogger: string | ILogger): Audit {
  const logger =
    typeof appNameOrLogger === "string"
      ? createLogger({
          appName: appNameOrLogger,
          console: { level: LogLevel.INFO },
        })
      : appNameOrLogger;

  return new Audit(logger);
}
