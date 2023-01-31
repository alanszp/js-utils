import { ILogger } from "@alanszp/logger";
import { SplitFactory } from "@splitsoftware/splitio";
import { now } from "../helpers/now";

/**
 * Hack to force the compiler to import the types
 * @deprecated
 */
export type DoNotUseSplitFactoryType = typeof SplitFactory;

const ON = "on";
const CONTROL = "control";

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

  constructor({ apiKey, logger, debug = false }: SplitClientConstructor) {
    BaseSplitClient.logger = logger;

    const factory = SplitFactory({
      core: {
        authorizationKey: apiKey,
      },
      scheduler: {
        impressionsRefreshRate: 60,
      },
      debug,
    });

    const startedTime = now();
    BaseSplitClient.client = factory.client();

    this.promiseConstruction = BaseSplitClient.client
      .ready()
      .then(() => {
        BaseSplitClient.logger.info("split_io_client.created.succeed", {
          executionTime: now() - startedTime,
        });
        return true;
      })
      .catch((error) => {
        BaseSplitClient.logger.info("split_io_client.created.error", {
          executionTime: now() - startedTime,
          error,
        });
        return false;
      });
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
