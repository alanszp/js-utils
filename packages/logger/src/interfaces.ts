export enum LogLevel {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export enum LogType {
  APP = "app",
  ACCESS = "access",
}

export interface Context {
  [key: string]: any;
}

export interface ILogger {
  trace(code: string, context?: Context): void;
  debug(code: string, context?: Context): void;
  info(code: string, context?: Context): void;
  warn(code: string, context?: Context): void;
  error(code: string, context?: Context): void;
  child(context?: Context): ILogger;
}
