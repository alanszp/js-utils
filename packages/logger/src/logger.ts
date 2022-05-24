import * as BunyanLogger from "bunyan";
import { Context, ILogger, LogLevel } from "@alanszp/common-models";
import { serialize } from "./serializer";

export class Logger implements ILogger {
  public baseLogger: BunyanLogger;
  public serializers?: BunyanLogger.Serializers;

  constructor(
    baseLogger: BunyanLogger,
    serializers?: BunyanLogger.Serializers
  ) {
    this.baseLogger = baseLogger;
    this.serializers = serializers;
  }

  public trace(code: string, context?: Context): void {
    this.log(LogLevel.TRACE, code, context);
  }

  public debug(code: string, context?: Context) {
    this.log(LogLevel.DEBUG, code, context);
  }

  public info(code: string, context?: Context) {
    this.log(LogLevel.INFO, code, context);
  }

  public warn(code: string, context?: Context) {
    this.log(LogLevel.WARN, code, context);
  }

  public error(code: string, context?: Context) {
    this.log(LogLevel.ERROR, code, context);
  }

  public child(context?: Context): Logger {
    return new Logger(this.baseLogger.child(context || {}));
  }

  private log(level: LogLevel, code: string, context: Context = {}): void {
    if (this.serializers) {
      context = { ...context };
      for (const key in this.serializers) {
        try {
          if (context[key]) {
            context[key] = this.serializers[key](context[key]);
          }
        } catch {}
      }
    }
    this.baseLogger[level](serialize(context), code);
  }
}
