import { IDatadogClient } from "@alanszp/datadog-client";
import { Serializers } from "bunyan";
import { LogLevel } from "./interfaces";

export interface ConsoleLoggerConfig {
  level: LogLevel;
}

export interface FileRotation {
  periodDays: number;
  count: number;
}

export interface FileLoggerConfig {
  path: string;
  name: string;
  level: LogLevel;
  rotate?: FileRotation;
}

export interface DatadogConfig {
  client: IDatadogClient;
}

export type SerializersConfig = Serializers;

export interface LoggerConfig {
  appName: string;
  file?: FileLoggerConfig;
  console?: ConsoleLoggerConfig;
  datadog?: DatadogConfig;
  serializers?: SerializersConfig;
}
