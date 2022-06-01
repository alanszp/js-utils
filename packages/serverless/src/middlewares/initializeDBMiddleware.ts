import { MiddlewareObj } from "@middy/core";
import { createConnection, ConnectionOptions } from "typeorm";

export function initializeDBMiddleware<TEvent, TResult>(
  connectionOptions: ConnectionOptions
): MiddlewareObj<TEvent, TResult> {
  return {
    before: async (request): Promise<void> => {
      const dbConnection = await createConnection(connectionOptions);

      Object.assign(request.context, { ...request.context, dbConnection });
    },
  };
}
