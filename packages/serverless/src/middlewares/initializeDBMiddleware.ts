import { MiddlewareObj } from "@middy/core";
import { createConnection, getConnection, ConnectionOptions } from "typeorm";

function hasConnection(name: string | undefined): boolean {
  try {
    return Boolean(getConnection(name));
  } catch (error) {
    return false;
  }
}

export function initializeDBMiddleware<TEvent, TResult>(
  connectionOptions: ConnectionOptions | (() => ConnectionOptions)
): MiddlewareObj<TEvent, TResult> {
  return {
    before: async (): Promise<void> => {
      const opts =
        typeof connectionOptions === "function"
          ? connectionOptions()
          : connectionOptions;
      if (!hasConnection(opts.name)) {
        await createConnection(opts);
      }
    },
  };
}
