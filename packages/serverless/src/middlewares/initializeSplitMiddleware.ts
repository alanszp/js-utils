import type { SplitClient } from "@alanszp/split";
import { MiddlewareObj } from "@middy/core";
import { SplitCouldNotLoadError } from "../errors/splitCouldNotLoadError";

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
