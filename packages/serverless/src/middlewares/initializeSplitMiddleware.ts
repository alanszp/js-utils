import { MiddlewareObj } from "@middy/core";
import { SplitCouldNotLoadError } from "../errors/splitCouldNotLoadError";

// TODO move interface to other place
interface SplitClient {
  hasLoaded(): Promise<boolean>;
  destroy(): Promise<void>;
}

export function initializeSplitMiddleware<TEvent, TResult>(
  splitClient: SplitClient
): MiddlewareObj<TEvent, TResult> {
  return {
    before: async (): Promise<void> => {
      const loaded = await splitClient.hasLoaded();
      if (!loaded) {
        throw new SplitCouldNotLoadError();
      }
    },
    after: async (): Promise<void> => {
      await splitClient.destroy();
    },
  };
}
