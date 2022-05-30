import { ILogger } from "@alanszp/logger";
import { Audit } from "@alanszp/audit";
import { SharedContext } from "@alanszp/shared-context";
import { Context } from "aws-lambda";
import middy, { MiddlewareObj } from "@middy/core";
import cuid from "cuid";
import { appIdentifier } from "@alanszp/core";

export type Lambda<TEvent, TContext, TResult> = (
  event: TEvent,
  context: TContext
) => Promise<TResult> | void;

export function withContext<TEvent, TContext extends Context, TResult>(
  sharedContext: SharedContext,
  handler: Lambda<TEvent, TContext, TResult>,
  middlewares: MiddlewareObj<TEvent, TResult>[],
  baseLogger: ILogger,
  audit: Audit
): Lambda<TEvent, TContext, TResult> {
  return (event, context) =>
    sharedContext.run(
      async () => {
        // eslint-disable-next-line unicorn/no-array-reduce
        const handlerWithExecutionContext = middlewares.reduce(
          (currentHandler, newMiddleware) => currentHandler.use(newMiddleware),
          middy(handler)
        );
        return handlerWithExecutionContext(event, context);
      },
      baseLogger,
      audit,
      cuid(),
      appIdentifier(),
      cuid()
    );
}
