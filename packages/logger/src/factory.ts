import { createLogger as createBunyanLogger, Stream } from "bunyan";
import { resolve } from "path";
import {
  ConsoleLoggerConfig,
  FileLoggerConfig,
  LoggerConfig,
  SlackConfig,
} from "./config";
import { ILogger } from "./interfaces";
import { Logger } from "./logger";
import { SlackStream } from "./slackBunyan";
import { LogLevel } from "./interfaces";

const minimumConsoleLogger = new Set([
  LogLevel.INFO,
  LogLevel.DEBUG,
  LogLevel.TRACE,
]);

function consoleStreamFactory(config: ConsoleLoggerConfig): Stream {
  if (!minimumConsoleLogger.has(config.level)) {
    throw new Error("Configure console logger with level INFO, DEBUG or TRACE");
  }

  return {
    level: config.level,
    stream: process.stdout,
  };
}

function fileStreamFactory(config: FileLoggerConfig): Stream {
  const stream: Stream = {
    level: config.level,
    path: resolve(config.path, config.name),
  };

  if (config.rotate) {
    stream.type = "rotating-file";
    stream.period = `${config.rotate.periodDays}d`;
    stream.count = config.rotate.count;
  }

  return stream;
}

function slackStreamFactory(config: SlackConfig): Stream {
  return {
    type: "raw",
    level: config.level,
    stream: new SlackStream(config.options),
  };
}

export function createStreams(config: LoggerConfig): Stream[] {
  const streams: Stream[] = [];

  if (config.file) {
    streams.push(fileStreamFactory(config.file));
  }

  if (config.console) {
    streams.push(consoleStreamFactory(config.console));
  }

  if (config.slack) {
    streams.push(slackStreamFactory(config.slack));
  }

  return streams;
}

export function createLogger(config: LoggerConfig): ILogger {
  const bunyanLogger = createBunyanLogger({
    name: config.appName,
    streams: createStreams(config),
  });

  return new Logger(bunyanLogger, config.serializers);
}
