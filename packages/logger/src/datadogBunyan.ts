import { IDatadogClient } from "@alanszp/datadog-client";

export class DatadogStream {
  private client: IDatadogClient;

  constructor(datadogCliient: IDatadogClient) {
    this.client = datadogCliient;
  }

  public write(payload: any) {
    this.client.increment("logs.error", 1, [`code:${payload.msg}`]);
  }
}
