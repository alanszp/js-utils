import { IDatadogClient } from "@alanszp/datadog-client";
import { WriteFn } from "bunyan";

export class DatadogStream implements WriteFn {
  private client: IDatadogClient;

  constructor(datadogClient: IDatadogClient) {
    this.client = datadogClient;
  }

  public write(payload: any): void {
    this.client.increment("logs.error", 1, [`code:${payload.msg}`]);
  }
}
