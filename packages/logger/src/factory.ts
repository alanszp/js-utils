import { DatadogStream } from "@alanszp/datadog-bunyan";
import {
  createLogger as createBunyanLogger,
  Serializers,
  Stream,
} from "bunyan";
import { resolve } from "path";
import {
  ConsoleLoggerConfig,
  DatadogConfig,
  FileLoggerConfig,
  LoggerConfig,
  SerializersConfig,
} from "./config";
import { ILogger, LogLevel } from "./interfaces";
import { Logger } from "./logger";

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
    stream: new DatadogStream(config.client),
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

  return streams;
}

export function createLogger(config: LoggerConfig): ILogger {
  const bunyanLogger = createBunyanLogger({
    name: config.appName,
    streams: createStreams(config),
  });

  return new Logger(bunyanLogger, config.serializers);
}
