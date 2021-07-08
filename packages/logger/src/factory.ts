import { DatadogStream } from "./datadogBunyan";
import { createLogger as createBunyanLogger, Stream } from "bunyan";
import { resolve } from "path";
import {
  ConsoleLoggerConfig,
  DatadogConfig,
  FileLoggerConfig,
  LoggerConfig,
  SlackConfig,
} from "./config";
import { ILogger, LogLevel } from "./interfaces";
import { Logger } from "./logger";
import { SlackStream } from "./slackBunyan";

function consoleStreamFactory(config: ConsoleLoggerConfig): Stream {
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

function datadogStreamFactory(config: DatadogConfig): Stream {
  return {
    type: "raw",
    level: LogLevel.ERROR,
    stream: new DatadogStream(config.client) as Stream,
  };
}

function slackStreamFactory(config: SlackConfig): Stream {
  return {
    type: "raw",
    level: config.level,
    stream: new SlackStream(config.options) as Stream,
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

  if (config.datadog) {
    streams.push(datadogStreamFactory(config.datadog));
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
