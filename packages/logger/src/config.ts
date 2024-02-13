import { Serializers } from "bunyan";
import { LogLevel } from "./interfaces";
import { SlackStreamOptions } from "./slackBunyan";

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

export interface SlackConfig {
  level: LogLevel;
  options: SlackStreamOptions;
}

export type SerializersConfig = Serializers;

export interface LoggerConfig {
  appName: string;
  file?: FileLoggerConfig;
  console?: ConsoleLoggerConfig;
  slack?: SlackConfig;
  serializers?: SerializersConfig;
}
