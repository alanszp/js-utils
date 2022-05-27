export interface ILogger {
  trace(code: string, context?: Context): void;
  debug(code: string, context?: Context): void;
  info(code: string, context?: Context): void;
  warn(code: string, context?: Context): void;
  error(code: string, context?: Context): void;
  child(context?: Context): ILogger;
}

export interface Context {
  [key: string]: any;
}

export enum LogType {
  APP = "app",
  ACCESS = "access",
  AUDIT = "audit",
}

export enum LogLevel {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}
