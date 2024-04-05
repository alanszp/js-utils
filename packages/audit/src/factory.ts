import { createLogger, ILogger, LogLevel } from "@alanszp/logger";
import { Audit } from "./audit";

export function createAuditLogger(appName: string, shouldLog?: boolean): Audit;
export function createAuditLogger(logger: ILogger): Audit;
export function createAuditLogger(
  appNameOrLogger: string | ILogger,
  shouldLog = true
): Audit {
  const logger =
    typeof appNameOrLogger === "string"
      ? createLogger({
          appName: appNameOrLogger,
          ...(shouldLog ? { console: { level: LogLevel.INFO } } : {}),
        })
      : appNameOrLogger;

  return new Audit(logger);
}
