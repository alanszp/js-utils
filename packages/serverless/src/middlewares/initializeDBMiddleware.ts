import { MiddlewareObj } from "@middy/core";
import { getDatabaseConnection } from "@alanszp/typeorm";
import { ConnectionOptions } from "typeorm";

export function initializeDBMiddleware<TEvent, TResult>(
  testOrmconfig: ConnectionOptions,
  connectionOptions: ConnectionOptions
): MiddlewareObj<TEvent, TResult> {
  return {
    before: async (request): Promise<void> => {
      const dbConnection = await getDatabaseConnection(
        testOrmconfig,
        connectionOptions
      );

      Object.assign(request.context, { ...request.context, dbConnection });
    },
  };
}
