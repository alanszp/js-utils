import type { BaseSplitClient } from "@alanszp/split";
import { MiddlewareObj } from "@middy/core";
import { SplitCouldNotLoadError } from "../errors/splitCouldNotLoadError";

export function initializeSplitMiddleware<TEvent, TResult>(
  splitClient: BaseSplitClient
): MiddlewareObj<TEvent, TResult> {
  return {
    before: async (): Promise<void> => {
      const loaded = await splitClient.hasLoaded();
      if (!loaded) {
        try {
          await splitClient.destroy();
        } catch (error) {}
        throw new SplitCouldNotLoadError();
      }
    },
    after: async (): Promise<void> => {
      await splitClient.destroy();
    },
  };
}
