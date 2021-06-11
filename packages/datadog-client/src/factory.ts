import {
  BufferedMetricsLogger,
  BufferedMetricsLoggerOptions,
} from "datadog-metrics";
import { hostname } from "os";
import { DatadogClientConfig, IDatadogClient } from "./interfaces";
import { mockClient } from "./mock";

const DEFAULT_FLUSH_INTERVAL_SECONDS = 10;

function createDatadogClient(config: DatadogClientConfig): IDatadogClient {
  const opts: BufferedMetricsLoggerOptions = {
    apiKey: config.apiKey,
    appKey: config.appKey,
    host: hostname(),
    prefix: config.prefix,
    flushIntervalSeconds:
      config.flushIntervalSeconds || DEFAULT_FLUSH_INTERVAL_SECONDS,
    defaultTags: [`env:${config.env}`, ...(config.defaultTags || [])],
  } as BufferedMetricsLoggerOptions;
  return new BufferedMetricsLogger(opts);
}

export function newClient(config: DatadogClientConfig): IDatadogClient {
  if (!config.enabled) {
    return mockClient;
  }

  return createDatadogClient(config);
}
