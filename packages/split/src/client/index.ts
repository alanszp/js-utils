import { ILogger } from "@alanszp/logger";
import { SplitFactory } from "@splitsoftware/splitio";

const ON = "on";
const CONTROL = "control";
const TIMEOUT_ERROR = 6000;

export interface SplitClientConstructor {
  apiKey: string;
  logger: ILogger;
  timeout: number;
  debug: boolean;
}

export class BaseSplitClient {
  protected static client: SplitIO.IClient;

  protected static logger: ILogger;

  protected promiseConstruction: Promise<boolean>;

  constructor({
    apiKey,
    logger,
    timeout = TIMEOUT_ERROR,
    debug = false,
  }: SplitClientConstructor) {
    BaseSplitClient.logger = logger;

    const factory = SplitFactory({
      core: {
        authorizationKey: apiKey,
      },
      scheduler: {
        impressionsRefreshRate: 1,
        eventsPushRate: 2,
      },
      debug,
    });

    BaseSplitClient.client = factory.client();

    this.promiseConstruction = Promise.race([
      new Promise<true>((resolve) => {
        BaseSplitClient.client.on(
          BaseSplitClient.client.Event.SDK_READY,
          () => {
            BaseSplitClient.logger.info("split_io_client.created.succeed");
            resolve(true);
          }
        );
      }),
      new Promise<false>((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, timeout);
      }),
    ]);
  }

  hasLoaded(): Promise<boolean> {
    return this.promiseConstruction;
  }

  getTreatment(key: string, splitName: string, attributes = {}): string {
    const treatment = BaseSplitClient.client.getTreatment(
      key,
      splitName,
      attributes
    );

    if (treatment === CONTROL) {
      BaseSplitClient.logger.warn(
        "split_io_client.created.sdk_return_control",
        {
          key,
          splitName,
          attributes,
        }
      );
    }

    return treatment;
  }

  getBooleanTreatment(
    key: string,
    splitName: string,
    attributes = {}
  ): boolean {
    const treatment = this.getTreatment(key, splitName, attributes);
    return treatment === ON;
  }

  async destroy(): Promise<void> {
    await BaseSplitClient.client.destroy();
  }
}
