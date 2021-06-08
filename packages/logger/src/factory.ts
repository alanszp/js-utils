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

/* Based on Bunyan error serializer */
function getFullErrorStack(ex) {
  let ret = ex.stack || ex.toString();
  if (ex.cause && typeof ex.cause === "function") {
    const cex = ex.cause();
    if (cex) {
      ret += `\nCaused by: ${getFullErrorStack(cex)}`;
    }
  }
  return ret;
}

/* Based on Bunyan error serializer */
function errorSerializer(err) {
  if (!err || !err.stack) {
    return err;
  }
  return {
    message: err.message,
    name: err.name,
    code: err.code,
    context: err.context,
    status: err.status,
    signal: err.signal,
    devMessage: err.devMessage,
    stack: getFullErrorStack(err),
  };
}

function createSerializers(customs?: SerializersConfig): Serializers {
  let additionalSerializers: Serializers = {};
  if (customs) {
    additionalSerializers = customs;
  }

  return {
    err: errorSerializer,
    error: errorSerializer,
    ...additionalSerializers,
  };
}

export function createLogger(config: LoggerConfig): ILogger {
  const bunyanLogger = createBunyanLogger({
    name: config.appName,
    streams: createStreams(config),
    serializers: createSerializers(config.serializers),
  });

  return new Logger(bunyanLogger);
}
