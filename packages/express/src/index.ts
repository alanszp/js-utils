import { IDatadogClient } from "@alanszp/datadog-client";
import { Writable } from "stream";

export class DatadogStream extends Writable {
  private client: IDatadogClient;

  constructor(datadogCliient: IDatadogClient) {
    super({
      objectMode: true,
    });
    this.client = datadogCliient;
  }

  public _write(payload: any) {
    this.client.increment("logs.error", 1, [`code:${payload.code}`]);
  }
}
