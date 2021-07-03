import type { Logger } from "typeorm";
import type { ILogger } from "@alanszp/logger";

export type GetRequestLogger = () => ILogger;

export class TypeOrmLogger implements Logger {
  public logOnlySlowQueries: boolean;
  public getRequestLogger: GetRequestLogger;

  constructor(getRequestLogger: GetRequestLogger, logOnlySlowQueries = true) {
    this.logOnlySlowQueries = logOnlySlowQueries;
    this.getRequestLogger = getRequestLogger;
  }

  logQuerySlow(time: number, query: string): void {
    this.getRequestLogger().warn("db.slow_query", {
      time,
      query,
    });
  }

  logQuery(query: string, parameters?: unknown[]) {
    if (this.logOnlySlowQueries) return;

    this.getRequestLogger().debug("db.query", {
      query,
      parameters,
    });
  }

  logQueryError(error: string | Error, query: string, parameters?: unknown[]) {
    if (this.logOnlySlowQueries) return;

    this.getRequestLogger().warn("db.query_error", {
      error,
      query,
      parameters,
    });
  }

  logSchemaBuild(message: string) {
    if (this.logOnlySlowQueries) return;

    this.getRequestLogger().debug("db.schema_build", {
      message,
    });
  }

  logMigration(message: string) {
    if (this.logOnlySlowQueries) return;

    this.getRequestLogger().debug("db.schema_build", {
      message,
    });
  }

  log(level: "warn" | "info" | "log", logMessage: unknown) {
    if (this.logOnlySlowQueries) return;

    const logLevel = level === "warn" ? "warn" : "info";
    this.getRequestLogger()[logLevel]("db.general_log", { logMessage });
  }
}
