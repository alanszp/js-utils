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
  connectionOptions: ConnectionOptions
): MiddlewareObj<TEvent, TResult> {
  return {
    before: async (): Promise<void> => {
      if (!hasConnection(connectionOptions.name)) {
        await createConnection(connectionOptions);
      }
    },
  };
}
