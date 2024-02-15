import { ILogger } from "@alanszp/logger";
import { Audit } from "@alanszp/audit";
import { SharedContext } from "@alanszp/shared-context";
import { Context } from "aws-lambda";
import middy, { MiddlewareObj } from "@middy/core";
import { createId } from "@paralleldrive/cuid2";
import { appIdentifier } from "@alanszp/core";
import { Lambda } from "../../types";

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
        const handlerWithExecutionContext = middlewares.reduce(
          (currentHandler, newMiddleware) => currentHandler.use(newMiddleware),
          middy(handler)
        );
        return handlerWithExecutionContext(event, context);
      },
      {
        logger: baseLogger,
        audit: audit.withState(),
        lifecycleId: createId(),
        lifecycleChain: appIdentifier(),
        contextId: createId(),
      }
    );
}
